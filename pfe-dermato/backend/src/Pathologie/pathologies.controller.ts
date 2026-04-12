import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PathologiesService } from './pathologies.service';
import { JwtAuthGuard } from '../auth/Jwt-auth.guard';

@Controller('pathologies')
export class PathologiesController {
  constructor(private readonly pathologiesService: PathologiesService) {}

  @Get()
  findAll() {
    return this.pathologiesService.findAll();
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.pathologiesService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pathologiesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body()
    body: {
      code: string;
      nom: string;
      description?: string;
      gravite: 'faible' | 'moderee' | 'elevee';
    },
  ) {
    return this.pathologiesService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.pathologiesService.update(id, body);
  }
}