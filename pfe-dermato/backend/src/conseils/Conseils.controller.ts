// backend/src/conseils/conseils.controller.ts
import {
  Controller, Get, Post, Put, Delete,
  Param, Body, UseGuards, ParseIntPipe, Query,
} from '@nestjs/common';
import { ConseilsService } from './Conseils.service';
import { JwtAuthGuard } from '../auth/Jwt-auth.guard';


@Controller('conseils') // → /conseils
export class ConseilsController {
  constructor(private conseilsService: ConseilsService) {}

  // GET /conseils/pathologie/:pathologieId
  // → Tous les conseils d'une pathologie
  // → Appelé après analyse IA pour afficher les conseils à l'utilisateur
  @Get('pathologie/:pathologieId')
  findByPathologie(@Param('pathologieId', ParseIntPipe) id: number) {
    return this.conseilsService.findByPathologie(id);
  }

  // GET /conseils/pathologie/:pathologieId/urgents
  // → Conseils urgents uniquement (niveau urgence élevée)
  @Get('pathologie/:pathologieId/urgents')
  findUrgents(@Param('pathologieId', ParseIntPipe) id: number) {
    return this.conseilsService.findUrgents(id);
  }

  // GET /conseils/:id
  // → Détail d'un conseil
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.conseilsService.findOne(id);
  }

  // POST /conseils
  // → Créer un conseil (admin seulement)
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: {
    pathologieId: number;
    titre: string;
    contenu: string;
    type: 'prevention' | 'traitement' | 'urgence' | 'information';
    ordre?: number;
  }) {
    return this.conseilsService.create(body);
  }

  // PUT /conseils/:id
  // → Modifier un conseil (admin)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.conseilsService.update(id, body);
  }

@Get('tips')
async getTips(@Query('limit') limit: string = '3') {
  const parsedLimit = Number(limit) || 3;
  return this.conseilsService.getTips(parsedLimit);
}

  // DELETE /conseils/:id
  // → Supprimer un conseil (admin)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  supprimer(@Param('id', ParseIntPipe) id: number) {
    return this.conseilsService.supprimer(id);
  }
}