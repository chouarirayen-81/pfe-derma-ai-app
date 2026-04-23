import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalysesController } from './analyses.controller';
import { AnalysesService } from './analyses.service';
import { AnalyseEntity } from '../database/entities/analyse.entity';
import { UtilisateurEntity } from '../database/entities/utilisateur.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyseEntity, UtilisateurEntity])],
  controllers: [AnalysesController],
  providers: [AnalysesService],
})
export class AnalysesModule {}