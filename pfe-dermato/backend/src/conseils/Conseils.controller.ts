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
import { ConseilsService } from './Conseils.service';
import { JwtAuthGuard } from '../auth/Jwt-auth.guard';

@Controller('conseils')
export class ConseilsController {
  constructor(private readonly conseilsService: ConseilsService) {}

  @Get('stats')
  async getStats(@Query('pathologieId') pathologieId?: string) {
    const parsedPathologieId = pathologieId ? Number(pathologieId) : undefined;
    const data = await this.conseilsService.getStats(parsedPathologieId);
    return { data };
  }

  @Get('tips')
  async getTips(@Query('limit') limit: string = '3') {
    const data = await this.conseilsService.getTips(Number(limit) || 3);
    return { data };
  }

  @Get('pathologie/:pathologieId/urgents')
  async findUrgents(
    @Param('pathologieId', ParseIntPipe) id: number,
  ) {
    const data = await this.conseilsService.findUrgents(id);
    return { data };
  }
@Get('test')
test() {
  return { ok: true };
}

  @Get('pathologie/:pathologieId')
  async findByPathologie(
    @Param('pathologieId', ParseIntPipe) id: number,
  ) {
    const data = await this.conseilsService.findByPathologie(id);
    return { data };
  }

  @Get()
  async findAll() {
    const data = await this.conseilsService.findAll();
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.conseilsService.findOne(id);
    return { data };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: any) {
    const data = await this.conseilsService.create(body);
    return { data };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    const data = await this.conseilsService.update(id, body);
    return { data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async supprimer(@Param('id', ParseIntPipe) id: number) {
    const data = await this.conseilsService.supprimer(id);
    return { data };
  }
}