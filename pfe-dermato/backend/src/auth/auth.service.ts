// backend/src/auth/auth.service.ts

import {
  Injectable, UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { Utilisateur } from '../utilisateurs/utilisateur.entity';
import { RefreshToken } from './Refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepo: Repository<Utilisateur>,

    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,

    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

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