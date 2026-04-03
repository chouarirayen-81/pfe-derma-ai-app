// backend/src/utilisateurs/utilisateurs.service.ts
import {
  Injectable, NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';
import * as bcrypt          from 'bcrypt';
import { Utilisateur }      from './utilisateur.entity';

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
      nom?:       string;
      prenom?:    string;
      age?:       number;
      sexe?:      string;
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

  // ── Supprimer le compte ───────────────────────────────────
  async supprimerCompte(id: number): Promise<{ message: string }> {
    await this.utilisateurRepo.update(id, { actif: false });
    return { message: 'Compte désactivé avec succès' };
  }
}