// backend/src/utilisateurs/utilisateurs.service.ts
import {
  Injectable, NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';
import * as bcrypt          from 'bcrypt';
import { Utilisateur }      from './utilisateur.entity';

import { UpdateMedicalFormDto } from './dto/update-medical-form.dto';

@Injectable()
export class UtilisateursService {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepo: Repository<Utilisateur>,
  ) {}

  // ── Récupérer profil complet ──────────────────────────────
  async findById(id: number): Promise<Utilisateur> {
    const user = await this.utilisateurRepo.findOne({ where: { id, actif: true } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  // ── Modifier le profil ────────────────────────────────────
  async modifierProfil(
  id: number,
  data: {
    nom?: string;
    prenom?: string;
    age?: number;
    sexe?: 'homme' | 'femme' | 'autre';
    telephone?: string;
    allergies?: string;
  },
): Promise<Utilisateur> {
  await this.utilisateurRepo.update(id, data);
  return this.findById(id);
}

  // ── Changer le mot de passe ───────────────────────────────
  async changerMotDePasse(
    id: number,
    ancienMotDePasse: string,
    nouveauMotDePasse: string,
  ): Promise<{ message: string }> {
    const user = await this.utilisateurRepo.findOne({
      where: { id },
      select: ['id', 'passwordHash'],
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    // Vérifier l'ancien mot de passe
    const valide = await bcrypt.compare(ancienMotDePasse, user.passwordHash);
    if (!valide) throw new UnauthorizedException('Ancien mot de passe incorrect');

    // Hasher le nouveau
    const newHash = await bcrypt.hash(nouveauMotDePasse, 12);
    await this.utilisateurRepo.update(id, { passwordHash: newHash });

    return { message: 'Mot de passe modifié avec succès' };
  }
async updateMedicalForm(user: any, dto: UpdateMedicalFormDto) {
  const userId = user.userId || user.sub;

  const utilisateur = await this.utilisateurRepo.findOne({
    where: { id: userId },
  });

  if (!utilisateur) {
    throw new Error('Utilisateur introuvable');
  }

  if (dto.nomComplet) {
    const parts = dto.nomComplet.trim().split(' ');
    utilisateur.prenom = parts[0] || utilisateur.prenom;
    utilisateur.nom = parts.slice(1).join(' ') || utilisateur.nom;
  }

  if (dto.age !== undefined) utilisateur.age = dto.age;
  if (dto.sexe !== undefined) utilisateur.sexe = dto.sexe as any;
  if (dto.antecedents !== undefined) utilisateur.antecedents = dto.antecedents;
  if (dto.allergies !== undefined) utilisateur.allergies = dto.allergies;
  if (dto.traitements !== undefined) utilisateur.traitements = dto.traitements;
  if (dto.dureeLesion !== undefined) utilisateur.dureeLesion = dto.dureeLesion;
  if (dto.symptomes !== undefined) utilisateur.symptomes = dto.symptomes;
  if (dto.zoneCorps !== undefined) utilisateur.zoneCorps = dto.zoneCorps;
  if (dto.observation !== undefined) utilisateur.observation = dto.observation;

  return await this.utilisateurRepo.save(utilisateur);
}
  // ── Supprimer le compte ───────────────────────────────────
  async supprimerCompte(id: number): Promise<{ message: string }> {
    await this.utilisateurRepo.update(id, { actif: false });
    return { message: 'Compte désactivé avec succès' };
  }
}