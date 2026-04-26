import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ConseilsService } from './conseils.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('conseils')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ConseilsController {
  constructor(private readonly conseilsService: ConseilsService) {}

  @Get()
  findAll() {
    return this.conseilsService.findAll();
  }

  @Post()
  create(
    @Body()
    body: {
      title: string;
      content: string;
      pathologieId: number;
      type?: 'prevention' | 'traitement' | 'urgence' | 'information';
      ordre?: number;
      valeur?: string;
      emoji?: string;
    },
  ) {
    return this.conseilsService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      content?: string;
      pathologieId?: number | null;
      type?: 'prevention' | 'traitement' | 'urgence' | 'information' | null;
      ordre?: number | null;
      valeur?: string;
      emoji?: string;
    },
  ) {
    return this.conseilsService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conseilsService.remove(+id);
  }
}