// backend/src/auth/auth.controller.ts

import {
  Controller, Post, Body, HttpCode,
  HttpStatus, UseGuards, Request, Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './Jwt-auth.guard';

// ── DTOs (Data Transfer Objects) ──────────────────────────
class RegisterDto {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone?: string;
}

class LoginDto {
  email: string;
  password: string;
}

// ── Controller ─────────────────────────────────────────────
@Controller('auth') // → /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /auth/register
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // POST /auth/login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // POST /auth/logout  (protégé — nécessite JWT valide)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }

  // GET /auth/me  → profil de l'utilisateur connecté
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Request() req) {
    return req.user;
  }
}