import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UtilisateurEntity } from '../database/entities/utilisateur.entity';
import { AnalyseEntity } from '../database/entities/analyse.entity';
import { ConseilEntity } from '../database/entities/conseil.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(UtilisateurEntity)
    private readonly usersRepository: Repository<UtilisateurEntity>,

    @InjectRepository(AnalyseEntity)
    private readonly analysesRepository: Repository<AnalyseEntity>,

    @InjectRepository(ConseilEntity)
    private readonly conseilsRepository: Repository<ConseilEntity>,
  ) {}

  async getStats() {
    const [totalUsers, totalAnalyses, totalConseils] = await Promise.all([
      this.usersRepository.count(),

      this.analysesRepository
        .createQueryBuilder('analyse')
        .where('COALESCE(analyse.supprime, 0) = 0')
        .getCount(),

      this.conseilsRepository
        .createQueryBuilder('conseil')
        .where('COALESCE(conseil.actif, 1) = 1')
        .getCount(),
    ]);

    return {
      totalUsers,
      totalAnalyses,
      totalConseils,
    };
  }
}