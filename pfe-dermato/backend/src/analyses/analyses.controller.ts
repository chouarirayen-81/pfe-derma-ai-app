import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Body,
  ParseFilePipeBuilder,
  Request
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';


import { AnalysesService } from './analyses.service';
import { JwtAuthGuard } from '../auth/Jwt-auth.guard';
import * as multer from 'multer';
@ApiTags('analyses')
@ApiBearerAuth('access-token')
@Controller('analyses')
@UseGuards(JwtAuthGuard)
export class AnalysesController {
  constructor(private readonly analysesService: AnalysesService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard utilisateur' })
  async getDashboard(@Req() req: Request & { user?: any }) {
    const userId = req.user?.userId || req.user?.sub;
    return this.analysesService.getDashboardData(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle analyse avec upload image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        source: {
          type: 'string',
          example: 'camera',
        },
      },
      required: ['image'],
    },
  })
  @UseInterceptors(
  FileInterceptor('image', {
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
  }),
)
async creer(@Request() req, @UploadedFile() file: Express.Multer.File) {
  const userId = req.user.userId || req.user.sub;
  return this.analysesService.creerAnalyse(userId, file);
}

  @Get(':id/qualite')
  @ApiOperation({ summary: "Vérifier la qualité de l'image via IA" })
  async verifierQualite(@Request() req, @Param('id', ParseIntPipe) id: number) {
  const userId = req.user.userId || req.user.sub;
  return this.analysesService.verifierQualite(id, userId);
}

  @Patch(':id/lancer')
  @ApiOperation({ summary: "Lancer l'analyse IA complète" })
  async lancer(
    @Req() req: Request & { user?: any },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user?.userId || req.user?.sub;
    return this.analysesService.lancerAnalyse(id, userId);
  }

  @Get(':id/statut')
  @ApiOperation({ summary: "Récupérer le statut de l'analyse" })
  async statut(
    @Req() req: Request & { user?: any },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user?.userId || req.user?.sub;
    return this.analysesService.statut(id, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Historique des analyses' })
  async historique(
    @Req() req: Request & { user?: any },
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('tri') tri = 'date',
  ) {
    const userId = req.user?.userId || req.user?.sub;
    return this.analysesService.historique(userId, parseInt(page, 10), parseInt(limit, 10), tri);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'une analyse" })
  async detail(
    @Req() req: Request & { user?: any },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user?.userId || req.user?.sub;
    return this.analysesService.detail(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une analyse' })
  async supprimer(
    @Req() req: Request & { user?: any },
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user?.userId || req.user?.sub;
    return this.analysesService.supprimer(id, userId);
  }
}