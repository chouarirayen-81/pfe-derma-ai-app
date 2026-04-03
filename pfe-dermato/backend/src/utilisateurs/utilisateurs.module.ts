// backend/src/utilisateurs/utilisateurs.module.ts
import { Module }                    from '@nestjs/common';
import { TypeOrmModule }             from '@nestjs/typeorm';
import { Utilisateur }               from './utilisateur.entity';
import { UtilisateursService }       from './utlisateurs.service';
import { UtilisateursController }    from './utilisateurs.controller';

@Module({
  imports:     [TypeOrmModule.forFeature([Utilisateur])],
  controllers: [UtilisateursController],
  providers:   [UtilisateursService],
  exports:     [UtilisateursService, TypeOrmModule],
})
export class UtilisateursModule {}