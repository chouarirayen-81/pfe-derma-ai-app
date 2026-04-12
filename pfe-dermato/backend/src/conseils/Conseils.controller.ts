import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConseilsService } from './conseils.service';
import { JwtAuthGuard } from '../auth/Jwt-auth.guard';

@Controller('conseils')
export class ConseilsController {
  constructor(private readonly conseilsService: ConseilsService) {}

  @Get('stats')
  async getStats(@Query('pathologieId') pathologieId?: string) {
    const parsedPathologieId = pathologieId ? Number(pathologieId) : undefined;
    return this.conseilsService.getStats(parsedPathologieId);
  }

  @Get('tips')
  async getTips(@Query('limit') limit: string = '3') {
    return this.conseilsService.getTips(Number(limit) || 3);
  }

  @Get('pathologie/:pathologieId/urgents')
  findUrgents(@Param('pathologieId', ParseIntPipe) id: number) {
    return this.conseilsService.findUrgents(id);
  }

  @Get('pathologie/:pathologieId')
  findByPathologie(@Param('pathologieId', ParseIntPipe) id: number) {
    return this.conseilsService.findByPathologie(id);
  }

  @Get()
  async findAll() {
    const data = await this.conseilsService.findAll();
    return { data };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.conseilsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: any) {
    return this.conseilsService.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.conseilsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  supprimer(@Param('id', ParseIntPipe) id: number) {
    return this.conseilsService.supprimer(id);
  }
}