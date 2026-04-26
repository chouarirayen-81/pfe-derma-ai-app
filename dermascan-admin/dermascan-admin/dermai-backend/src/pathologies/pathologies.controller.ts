import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PathologiesService } from './pathologies.service';

@Controller('pathologies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class PathologiesController {
  constructor(private readonly pathologiesService: PathologiesService) {}

  @Get()
  findAll() {
    return this.pathologiesService.findAll();
  }

  @Post()
  create(
    @Body()
    body: {
      code: string;
      nom: string;
      description?: string;
      gravite?: 'faible' | 'moderee' | 'elevee';
    },
  ) {
    return this.pathologiesService.create(body);
  }
}