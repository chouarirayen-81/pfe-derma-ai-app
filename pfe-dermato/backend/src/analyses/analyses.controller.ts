// backend/src/analyses/analyses.controller.ts
import {
  Controller, Post, Get, Delete,
  Param, Query, UseGuards, Request,
  UseInterceptors, UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor }  from '@nestjs/platform-express';
import {
  ApiTags, ApiOperation, ApiResponse,
  ApiBearerAuth, ApiConsumes, ApiBody,
  ApiQuery, ApiParam,
} from '@nestjs/swagger';
import { AnalysesService } from './Analyses.service';
import { JwtAuthGuard }    from '../auth/Jwt-auth.guard';

@ApiTags('🔬 Analyses')
@Controller('analyses')
@UseGuards(JwtAuthGuard)      // toutes les routes analyses nécessitent JWT
@ApiBearerAuth('JWT-auth')
export class AnalysesController {
  constructor(private analysesService: AnalysesService) {}

  // POST /analyses — envoyer une image pour analyse IA
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Envoyer une image cutanée pour analyse IA' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: { type: 'string', format: 'binary', description: 'Photo de la lésion' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Analyse créée — statut en_attente' })
  @ApiResponse({ status: 400, description: 'Aucune image reçue' })
  async creer(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.analysesService.creerAnalyse(req.user.userId, file);
  }

  // GET /analyses — historique des analyses
  @Get()
  @ApiOperation({ summary: 'Historique des analyses de l\'utilisateur connecté' })
  @ApiQuery({ name: 'page',  required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({
    name: 'tri', required: false,
    enum: ['date', 'gravite'],
    description: 'Trier par date ou gravité',
  })
  @ApiResponse({ status: 200, description: 'Liste paginée des analyses' })
  async historique(
    @Request() req,
    @Query('page')  page  = '1',
    @Query('limit') limit = '20',
    @Query('tri')   tri   = 'date',
  ) {
    return this.analysesService.historique(
      req.user.userId,
      parseInt(page),
      parseInt(limit),
      tri,
    );
  }

  // GET /analyses/:id/statut — vérifier le statut (polling)
  @Get(':id/statut')
  @ApiOperation({
    summary: 'Vérifier le statut d\'une analyse',
    description: 'Le mobile appelle cette route toutes les 2s jusqu\'à statut = termine',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Statut retourné' })
  async statut(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.analysesService.statut(id, req.user.userId);
  }

  // GET /analyses/:id — détail complet d'une analyse
  @Get(':id')
  @ApiOperation({ summary: 'Détail complet d\'une analyse avec résultats IA' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Analyse retournée' })
  @ApiResponse({ status: 404, description: 'Analyse introuvable' })
  async detail(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.analysesService.detail(id, req.user.userId);
  }

  // DELETE /analyses/:id — supprimer une analyse
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une analyse de l\'historique' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Analyse supprimée' })
  @ApiResponse({ status: 404, description: 'Analyse introuvable' })
  async supprimer(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.analysesService.supprimer(id, req.user.userId);
  }
}