import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { UtilisateurEntity } from '../database/entities/utilisateur.entity';
import { AnalyseEntity } from '../database/entities/analyse.entity';
import { ConseilEntity } from '../database/entities/conseil.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UtilisateurEntity,
      AnalyseEntity,
      ConseilEntity,
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}