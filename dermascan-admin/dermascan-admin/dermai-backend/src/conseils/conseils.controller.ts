import { Controller, Get, UseGuards } from '@nestjs/common';
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
}