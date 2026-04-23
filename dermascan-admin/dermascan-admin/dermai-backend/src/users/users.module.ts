import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UtilisateurEntity } from '../database/entities/utilisateur.entity';
import { AnalyseEntity } from '../database/entities/analyse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UtilisateurEntity, AnalyseEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}