import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AnalyseEntity } from '../database/entities/analyse.entity';

@Injectable()
export class AnalysesService {
  constructor(
    @InjectRepository(AnalyseEntity)
    private readonly analysesRepository: Repository<AnalyseEntity>,
  ) {}

  async findAll() {
    const analyses = await this.analysesRepository
      .createQueryBuilder('analyse')
      .leftJoinAndSelect('analyse.utilisateur', 'utilisateur')
      .where('COALESCE(analyse.supprime, 0) = 0')
      .orderBy('analyse.creeLe', 'DESC')
      .getMany();

    return analyses.map((analyse) => ({
      id: analyse.id,
      userId: analyse.utilisateurId,
      userName: analyse.utilisateur
        ? `${analyse.utilisateur.prenom ?? ''} ${analyse.utilisateur.nom ?? ''}`.trim()
        : null,
      userEmail: analyse.utilisateur?.email || null,
      imageUrl: analyse.imagePath,
      predictedClass: analyse.classePredite,
      confidence: analyse.scoreConfiance,
      createdAt: analyse.creeLe,
      status: analyse.statut,
      qualityScore: analyse.qualiteScore,
      urgence: analyse.niveauUrgence,
    }));
  }

  async remove(id: number) {
    const analyse = await this.analysesRepository.findOne({
      where: { id },
    });

    if (!analyse) {
      throw new NotFoundException('Analyse introuvable');
    }

    analyse.supprime = true;
    await this.analysesRepository.save(analyse);

    return {
      message: 'Analyse supprimée avec succès',
    };
  }
}