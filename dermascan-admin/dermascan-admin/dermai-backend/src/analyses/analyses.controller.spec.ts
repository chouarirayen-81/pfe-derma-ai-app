import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AnalysesService } from './analyses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('analyses')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AnalysesController {
  constructor(private readonly analysesService: AnalysesService) {}

  @Get()
  findAll() {
    return this.analysesService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.analysesService.remove(+id);
  }
}