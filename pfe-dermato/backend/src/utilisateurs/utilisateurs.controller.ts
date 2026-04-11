// backend/src/utilisateurs/utilisateurs.controller.ts
import {
  Controller, Get, Put, Delete,
  Body,Patch, Request, UseGuards,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse,
  ApiBearerAuth, ApiBody,
} from '@nestjs/swagger';
import { UtilisateursService } from './utlisateurs.service';
import { JwtAuthGuard }        from '../auth/Jwt-auth.guard';
import { UpdateMedicalFormDto } from './dto/update-medical-form.dto';
@ApiTags('👤 Profil utilisateur')
@Controller('utilisateurs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UtilisateursController {
  constructor(private utilisateursService: UtilisateursService) {}

  // GET /utilisateurs/profil
  @Get('profil')
  @ApiOperation({ summary: 'Récupérer mon profil complet' })
  @ApiResponse({ status: 200, description: 'Profil retourné' })
  getProfil(@Request() req) {
    return this.utilisateursService.findById(req.user.userId);
  }

  // PUT /utilisateurs/profil
  @Put('profil')
  @ApiOperation({ summary: 'Modifier mon profil' })
  @ApiBody({
    schema: {
      example: {
        nom: 'Dupont', prenom: 'Jean',
        age: 25, sexe: 'homme',
        telephone: '0612345678',
        allergies: 'Nickel, latex',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Profil modifié' })
  modifierProfil(@Request() req, @Body() body: any) {
    return this.utilisateursService.modifierProfil(req.user.userId, body);
  }

  // PUT /utilisateurs/password
  @Put('password')
  @ApiOperation({ summary: 'Changer mon mot de passe' })
  @ApiBody({
    schema: {
      example: {
        ancienMotDePasse:  'Test1234',
        nouveauMotDePasse: 'NouveauMdp2024!',
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Mot de passe modifié' })
  @ApiResponse({ status: 401, description: 'Ancien mot de passe incorrect' })
  changerMotDePasse(@Request() req, @Body() body: any) {
    return this.utilisateursService.changerMotDePasse(
      req.user.userId,
      body.ancienMotDePasse,
      body.nouveauMotDePasse,
    );
  }

  @Patch('me')
@UseGuards(JwtAuthGuard)
async updateMe(@Request() req, @Body() dto: UpdateMedicalFormDto) {
  return this.utilisateursService.updateMedicalForm(req.user, dto);
}

  // DELETE /utilisateurs/compte
  @Delete('compte')
  @ApiOperation({ summary: 'Désactiver mon compte' })
  @ApiResponse({ status: 200, description: 'Compte désactivé' })
  supprimerCompte(@Request() req) {
    return this.utilisateursService.supprimerCompte(req.user.userId);
  }
}