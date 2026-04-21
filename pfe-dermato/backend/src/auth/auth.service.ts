// backend/src/auth/auth.service.ts

import {
  Injectable, UnauthorizedException,BadRequestException,
  
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { Utilisateur } from '../utilisateurs/utilisateur.entity';
import { RefreshToken } from './Refresh-token.entity';
import { MailService } from '../utilisateurs/mail.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepo: Repository<Utilisateur>,
     private readonly mailService: MailService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,

    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  //mdp oubliee 

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.utilisateurRepo
      .createQueryBuilder('u')
      .addSelect(['u.passwordResetCodeHash', 'u.passwordResetExpiresAt'])
      .where('LOWER(u.email) = LOWER(:email)', { email: dto.email })
      .andWhere('u.actif = :actif', { actif: true })
      .getOne();

    if (!user) {
      throw new NotFoundException('Aucun compte trouvé avec cet email');
    }

    if (user.provider !== 'local') {
      throw new BadRequestException(
        'Réinitialisation disponible uniquement pour les comptes locaux',
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    user.passwordResetCodeHash = await bcrypt.hash(code, 10);
    user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.utilisateurRepo.save(user);
    await this.mailService.sendPasswordResetCode(user.email, code, user.prenom);

    return {
      message: 'Code de réinitialisation envoyé par email',
    };
  }

  async verifyResetCode(
    dto: VerifyResetCodeDto,
  ): Promise<{ message: string; valid: boolean }> {
    const user = await this.utilisateurRepo
      .createQueryBuilder('u')
      .addSelect(['u.passwordResetCodeHash', 'u.passwordResetExpiresAt'])
      .where('LOWER(u.email) = LOWER(:email)', { email: dto.email })
      .andWhere('u.actif = :actif', { actif: true })
      .getOne();

    if (!user) {
      throw new NotFoundException('Aucun compte trouvé avec cet email');
    }

    if (!user.passwordResetCodeHash || !user.passwordResetExpiresAt) {
      throw new BadRequestException(
        'Aucun code actif. Veuillez demander un nouveau code.',
      );
    }

    if (user.passwordResetExpiresAt.getTime() < Date.now()) {
      user.passwordResetCodeHash = null;
      user.passwordResetExpiresAt = null;
      await this.utilisateurRepo.save(user);

      throw new BadRequestException(
        'Le code a expiré. Veuillez demander un nouveau code.',
      );
    }

    const codeValide = await bcrypt.compare(
      dto.code,
      user.passwordResetCodeHash,
    );

    if (!codeValide) {
      throw new UnauthorizedException('Code de vérification incorrect');
    }

    return {
      message: 'Code valide',
      valid: true,
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.utilisateurRepo
      .createQueryBuilder('u')
      .addSelect(['u.passwordResetCodeHash', 'u.passwordResetExpiresAt'])
      .where('LOWER(u.email) = LOWER(:email)', { email: dto.email })
      .andWhere('u.actif = :actif', { actif: true })
      .getOne();

    if (!user) {
      throw new NotFoundException('Aucun compte trouvé avec cet email');
    }

    if (!user.passwordResetCodeHash || !user.passwordResetExpiresAt) {
      throw new BadRequestException(
        'Aucun code actif. Veuillez demander un nouveau code.',
      );
    }

    if (user.passwordResetExpiresAt.getTime() < Date.now()) {
      user.passwordResetCodeHash = null;
      user.passwordResetExpiresAt = null;
      await this.utilisateurRepo.save(user);

      throw new BadRequestException(
        'Le code a expiré. Veuillez demander un nouveau code.',
      );
    }

    const codeValide = await bcrypt.compare(
      dto.code,
      user.passwordResetCodeHash,
    );

    if (!codeValide) {
      throw new UnauthorizedException('Code de vérification incorrect');
    }

    const memeMotDePasse = await bcrypt.compare(
      dto.nouveauMotDePasse,
      user.passwordHash,
    );

    if (memeMotDePasse) {
      throw new BadRequestException(
        'Le nouveau mot de passe doit être différent de l’ancien',
      );
    }

    user.passwordHash = await bcrypt.hash(dto.nouveauMotDePasse, 12);
    user.passwordResetCodeHash = null;
    user.passwordResetExpiresAt = null;

    await this.utilisateurRepo.save(user);

    return {
      message: 'Mot de passe réinitialisé avec succès',
    };
  }


  // ── INSCRIPTION ──────────────────────────────────────────
  async register(dto: {
    nom:        string;
    prenom:     string;
    email:      string;
    password:   string;
    telephone?: string;
    age?:       number; // ✅ AJOUTÉ
  }) {
    const existe = await this.utilisateurRepo.findOne({
      where: { email: dto.email },
    });
    if (existe) throw new ConflictException('Email déjà utilisé');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = this.utilisateurRepo.create({
      nom:          dto.nom,
      prenom:       dto.prenom,
      email:        dto.email.toLowerCase().trim(),
      passwordHash,
      telephone:    dto.telephone,
      age:          dto.age, // ✅ AJOUTÉ
    });

    const saved = await this.utilisateurRepo.save(user);
    return this.genererTokens(saved);
  }

  // ── CONNEXION ─────────────────────────────────────────────
  async login(dto: { email: string; password: string }) {
    const user = await this.utilisateurRepo.findOne({
      where: { email: dto.email.toLowerCase().trim(), actif: true },
    });

    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');

    const mdpValide = await bcrypt.compare(dto.password, user.passwordHash);
    if (!mdpValide) throw new UnauthorizedException('Email ou mot de passe incorrect');

    return this.genererTokens(user);
  }


  
  // ── GÉNÉRATION DES TOKENS JWT ─────────────────────────────
  private async genererTokens(user: Utilisateur) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret:    this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:    this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    await this.refreshTokenRepo.save({
      utilisateurId: user.id,
      token:         await bcrypt.hash(refreshToken, 8),
      expiresAt:     expiry,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id:     user.id,
        nom:    user.nom,
        prenom: user.prenom,
        email:  user.email,
        role:   user.role,
      },
    };
  }

  // ── DÉCONNEXION ───────────────────────────────────────────
  async logout(userId: number) {
    await this.refreshTokenRepo.update(
      { utilisateurId: userId, revoque: false },
      { revoque: true },
    );
    return { message: 'Déconnecté avec succès' };
  }
}



