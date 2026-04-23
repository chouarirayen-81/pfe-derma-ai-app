import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      nom?: string;
      prenom?: string;
      email?: string;
      phone?: string;
      age?: number | null;
      sexe?: 'homme' | 'femme' | 'autre' | null;
      allergies?: string;
      antecedents?: string;
      traitements?: string;
      dureeLesion?: string;
      symptomes?: string;
      zoneCorps?: string;
      observation?: string;
      photoProfil?: string;
      role?: 'user' | 'admin';
      isActive?: boolean;
    },
  ) {
    return this.usersService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}