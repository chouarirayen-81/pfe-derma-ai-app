// backend/src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Ce guard protège les routes qui nécessitent un JWT valide
// Utilisation : @UseGuards(JwtAuthGuard) sur n'importe quel controller
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}