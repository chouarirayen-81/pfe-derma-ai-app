import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UtilisateurEntity } from '../database/entities/utilisateur.entity';
import { AnalyseEntity } from '../database/entities/analyse.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UtilisateurEntity)
    private readonly usersRepository: Repository<UtilisateurEntity>,
    @InjectRepository(AnalyseEntity)
    private readonly analysesRepository: Repository<AnalyseEntity>,
  ) {}

  async findAll() {
    const users = await this.usersRepository.find({
      order: { tempCreation: 'DESC' },
    });

    return users.map((user) => ({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      full_name: `${user.prenom ?? ''} ${user.nom ?? ''}`.trim(),
      email: user.email,
      phone: user.telephone,
      age: user.age,
      sexe: user.sexe,
      allergies: user.allergies,
      antecedents: user.antecedents,
      traitements: user.traitements,
      dureeLesion: user.dureeLesion,
      symptomes: user.symptomes,
      zoneCorps: user.zoneCorps,
      observation: user.observation,
      photoProfil: user.photoProfil,
      isActive: !!user.actif,
      role: user.role,
      createdAt: user.tempCreation,
    }));
  }

  async update(
    id: number,
    payload: {
      nom?: string;
      prenom?: string;
      email?: string;
      phone?: string;
      age?: number | null;
      sexe?: 'homme' | 'femme' | 'autre' | null;
      allergies?: string;
      antecedents?: string;
      traitements?: string;
      dureeLesion?: string;
      symptomes?: string;
      zoneCorps?: string;
      observation?: string;
      photoProfil?: string;
      role?: 'user' | 'admin';
      isActive?: boolean;
    },
  ) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (payload.email && payload.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: payload.email },
      });

      if (existingUser && existingUser.id !== user.id) {
        throw new BadRequestException('Cet email est déjà utilisé');
      }
    }

    if (payload.nom !== undefined) user.nom = payload.nom.trim();
    if (payload.prenom !== undefined) user.prenom = payload.prenom.trim();
    if (payload.email !== undefined) user.email = payload.email.trim();
    if (payload.phone !== undefined) user.telephone = payload.phone?.trim() || null;
    if (payload.age !== undefined) user.age = payload.age ?? null;
    if (payload.sexe !== undefined) user.sexe = payload.sexe ?? null;
    if (payload.allergies !== undefined) user.allergies = payload.allergies?.trim() || null;
    if (payload.antecedents !== undefined) user.antecedents = payload.antecedents?.trim() || null;
    if (payload.traitements !== undefined) user.traitements = payload.traitements?.trim() || null;
    if (payload.dureeLesion !== undefined) user.dureeLesion = payload.dureeLesion?.trim() || null;
    if (payload.symptomes !== undefined) user.symptomes = payload.symptomes?.trim() || null;
    if (payload.zoneCorps !== undefined) user.zoneCorps = payload.zoneCorps?.trim() || null;
    if (payload.observation !== undefined) user.observation = payload.observation?.trim() || null;
    if (payload.photoProfil !== undefined) user.photoProfil = payload.photoProfil?.trim() || null;
    if (payload.role !== undefined) user.role = payload.role;
    if (payload.isActive !== undefined) user.actif = payload.isActive;

    const saved = await this.usersRepository.save(user);

    return {
      message: 'Utilisateur mis à jour avec succès',
      user: {
        id: saved.id,
        nom: saved.nom,
        prenom: saved.prenom,
        full_name: `${saved.prenom ?? ''} ${saved.nom ?? ''}`.trim(),
        email: saved.email,
        phone: saved.telephone,
        age: saved.age,
        sexe: saved.sexe,
        allergies: saved.allergies,
        antecedents: saved.antecedents,
        traitements: saved.traitements,
        dureeLesion: saved.dureeLesion,
        symptomes: saved.symptomes,
        zoneCorps: saved.zoneCorps,
        observation: saved.observation,
        photoProfil: saved.photoProfil,
        isActive: !!saved.actif,
        role: saved.role,
        createdAt: saved.tempCreation,
      },
    };
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const linkedAnalyses = await this.analysesRepository.count({
      where: { utilisateurId: id },
    });

    if (linkedAnalyses > 0) {
      throw new BadRequestException(
        "Impossible de supprimer cet utilisateur car il possède déjà des analyses. Désactive-le ou modifie-le à la place.",
      );
    }

    await this.usersRepository.remove(user);

    return {
      message: 'Utilisateur supprimé avec succès',
    };
  }
}