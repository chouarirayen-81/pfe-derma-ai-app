import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UtilisateursService } from './utilisateurs.service';
import { JwtAuthGuard } from '../auth/Jwt-auth.guard';
import { UpdateMeDto } from './dto/update-me.dto';
import { SendVerificationCodeDto } from './dto/send-verification-code.dto';
import { ChangePasswordWithCodeDto } from './dto/change-password-with-code.dto';

@ApiTags('👤 Profil utilisateur')
@Controller('utilisateurs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UtilisateursController {
  constructor(
    private readonly utilisateursService: UtilisateursService,
  ) {}

  private getUserId(req: any): number {
    return req.user?.userId || req.user?.sub;
  }

  @Get('profil')
  @ApiOperation({ summary: 'Récupérer mon profil complet' })
  @ApiResponse({ status: 200, description: 'Profil récupéré avec succès' })
  getProfil(@Request() req: any) {
    return this.utilisateursService.findById(this.getUserId(req));
  }

  @Put('profil')
  @ApiOperation({ summary: 'Modifier mon profil (compatibilité ancienne route)' })
  @ApiResponse({ status: 200, description: 'Profil modifié avec succès' })
  modifierProfilCompat(@Request() req: any, @Body() dto: UpdateMeDto) {
    return this.utilisateursService.updateMe(this.getUserId(req), dto);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Modifier mon profil et mes informations médicales' })
  @ApiResponse({ status: 200, description: 'Profil mis à jour avec succès' })
  updateMe(@Request() req: any, @Body() dto: UpdateMeDto) {
    return this.utilisateursService.updateMe(this.getUserId(req), dto);
  }

 @Post('send-verification-code')
sendVerificationCode(
  @Request() req: any,
  @Body() dto: SendVerificationCodeDto,
) {
  return this.utilisateursService.sendVerificationCode(
    req.user?.userId || req.user?.sub,
    dto.ancienMotDePasse,
  );
}

  @Put('password')
  @ApiOperation({ summary: 'Changer mon mot de passe avec code de vérification' })
  @ApiResponse({ status: 200, description: 'Mot de passe modifié avec succès' })
  changerMotDePasse(
    @Request() req: any,
    @Body() dto: ChangePasswordWithCodeDto,
  ) {
    return this.utilisateursService.changerMotDePasseAvecCode(
      this.getUserId(req),
      dto,
    );
  }

  @Delete('compte')
  @ApiOperation({ summary: 'Désactiver mon compte' })
  @ApiResponse({ status: 200, description: 'Compte désactivé avec succès' })
  supprimerCompte(@Request() req: any) {
    return this.utilisateursService.supprimerCompte(this.getUserId(req));
  }
}