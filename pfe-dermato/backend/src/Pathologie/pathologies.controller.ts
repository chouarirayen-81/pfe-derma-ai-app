// backend/src/pathologies/pathologies.controller.ts
import {
  Controller, Get, Post, Put, Param,
  Body, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { PathologiesService } from './Pathologie.service';
import { JwtAuthGuard } from '../auth/Jwt-auth.guard';

@Controller('pathologies') // → /pathologies
export class PathologiesController {
  constructor(private pathologiesService: PathologiesService) {}

  // GET /pathologies
  // → Liste toutes les pathologies avec leurs conseils
  // → Accessible sans connexion (pour l'app mobile)
  @Get()
  findAll() {
    return this.pathologiesService.findAll();
  }

  // GET /pathologies/:id
  // → Détail d'une pathologie + ses conseils
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pathologiesService.findOne(id);
  }

  // GET /pathologies/code/:code
  // → Récupère par code IA (ex: /pathologies/code/acne)
  // → Utilisé après le résultat du microservice IA
  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.pathologiesService.findByCode(code);
  }

  // POST /pathologies
  // → Créer une pathologie (admin seulement)
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: {
    code: string;
    nom: string;
    description?: string;
    gravite: 'faible' | 'moderee' | 'elevee';
  }) {
    return this.pathologiesService.create(body);
  }

  // PUT /pathologies/:id
  // → Modifier une pathologie (admin seulement)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.pathologiesService.update(id, body);
  }
}