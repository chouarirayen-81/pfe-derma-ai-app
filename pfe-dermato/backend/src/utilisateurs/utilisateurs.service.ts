import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Utilisateur } from './utilisateur.entity';
import { UpdateMeDto } from './dto/update-me.dto';
import { ChangePasswordWithCodeDto } from './dto/change-password-with-code.dto';
import { MailService } from './mail.service';

@Injectable()
export class UtilisateursService {
  constructor(
    @InjectRepository(Utilisateur)
    private readonly utilisateurRepo: Repository<Utilisateur>,
    private readonly mailService: MailService,
  ) {}

  async findById(id: number): Promise<Utilisateur> {
    const user = await this.utilisateurRepo.findOne({
      where: { id, actif: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  async updateMe(id: number, dto: UpdateMeDto): Promise<Utilisateur> {
    const utilisateur = await this.utilisateurRepo.findOne({
      where: { id, actif: true },
    });

    if (!utilisateur) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (dto.nomComplet && (!dto.nom || !dto.prenom)) {
      const parts = dto.nomComplet.trim().split(/\s+/);
      if (parts.length === 1) {
        utilisateur.prenom = parts[0];
      } else if (parts.length >= 2) {
        utilisateur.prenom = parts[0];
        utilisateur.nom = parts.slice(1).join(' ');
      }
    }

    if (dto.nom !== undefined) utilisateur.nom = dto.nom;
    if (dto.prenom !== undefined) utilisateur.prenom = dto.prenom;
    if (dto.telephone !== undefined) utilisateur.telephone = dto.telephone;
    if (dto.age !== undefined) utilisateur.age = dto.age;
    if (dto.sexe !== undefined) utilisateur.sexe = dto.sexe;
    if (dto.allergies !== undefined) utilisateur.allergies = dto.allergies;
    if (dto.antecedents !== undefined) utilisateur.antecedents = dto.antecedents;
    if (dto.traitements !== undefined) utilisateur.traitements = dto.traitements;
    if (dto.dureeLesion !== undefined) utilisateur.dureeLesion = dto.dureeLesion;
    if (dto.symptomes !== undefined) utilisateur.symptomes = dto.symptomes;
    if (dto.zoneCorps !== undefined) utilisateur.zoneCorps = dto.zoneCorps;
    if (dto.observation !== undefined) utilisateur.observation = dto.observation;
    if (dto.doubleAuthActive !== undefined) {
      utilisateur.doubleAuthActive = dto.doubleAuthActive;
    }

    return await this.utilisateurRepo.save(utilisateur);
  }

  async sendVerificationCode(
  id: number,
  ancienMotDePasse: string,
): Promise<{ message: string }> {
  const user = await this.utilisateurRepo
    .createQueryBuilder('u')
    .addSelect(['u.passwordResetCodeHash', 'u.passwordResetExpiresAt'])
    .where('u.id = :id', { id })
    .andWhere('u.actif = :actif', { actif: true })
    .getOne();

  console.log('DEBUG sendVerificationCode => user trouvé ?', !!user);

  if (!user) {
    console.log('DEBUG => utilisateur introuvable');
    throw new NotFoundException('Utilisateur introuvable');
  }

  console.log('DEBUG => provider =', user.provider);
  console.log('DEBUG => email =', user.email);

  if (user.provider !== 'local') {
    console.log('DEBUG => compte non local');
    throw new BadRequestException(
      'Le changement de mot de passe est disponible uniquement pour les comptes locaux',
    );
  }

  const ancienValide = await bcrypt.compare(
    ancienMotDePasse,
    user.passwordHash,
  );

  console.log('DEBUG => ancien mot de passe valide ?', ancienValide);

  if (!ancienValide) {
    throw new UnauthorizedException('Ancien mot de passe incorrect');
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  user.passwordResetCodeHash = await bcrypt.hash(code, 10);
  user.passwordResetExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await this.utilisateurRepo.save(user);
  await this.mailService.sendPasswordResetCode(user.email, code, user.prenom);

  return {
    message: 'Code de vérification envoyé par email (valable 10 minutes)',
  };
}
  async changerMotDePasseAvecCode(
    id: number,
    dto: ChangePasswordWithCodeDto,
  ): Promise<{ message: string }> {
    const user = await this.utilisateurRepo
      .createQueryBuilder('u')
      .addSelect(['u.passwordResetCodeHash', 'u.passwordResetExpiresAt'])
      .where('u.id = :id', { id })
      .andWhere('u.actif = :actif', { actif: true })
      .getOne();

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (user.provider !== 'local') {
      throw new BadRequestException(
        'Le changement de mot de passe est disponible uniquement pour les comptes locaux',
      );
    }

    const ancienValide = await bcrypt.compare(
      dto.ancienMotDePasse,
      user.passwordHash,
    );

    if (!ancienValide) {
      throw new UnauthorizedException('Ancien mot de passe incorrect');
    }

    if (!user.passwordResetCodeHash || !user.passwordResetExpiresAt) {
      throw new BadRequestException(
        'Aucun code de vérification actif. Veuillez demander un nouveau code.',
      );
    }

    if (user.passwordResetExpiresAt.getTime() < Date.now()) {
      user.passwordResetCodeHash = null;
      user.passwordResetExpiresAt = null;
      await this.utilisateurRepo.save(user);

      throw new BadRequestException(
        'Le code de vérification a expiré. Veuillez demander un nouveau code.',
      );
    }

    const codeValide = await bcrypt.compare(
      dto.codeVerification,
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

    return { message: 'Mot de passe modifié avec succès' };
  }

  async supprimerCompte(id: number): Promise<{ message: string }> {
    const user = await this.utilisateurRepo.findOne({
      where: { id, actif: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    user.actif = false;
    user.passwordResetCodeHash = null;
    user.passwordResetExpiresAt = null;

    await this.utilisateurRepo.save(user);

    return { message: 'Compte désactivé avec succès' };
  }
}