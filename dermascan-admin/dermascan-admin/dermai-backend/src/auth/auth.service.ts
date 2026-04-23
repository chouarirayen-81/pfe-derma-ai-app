import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UtilisateurEntity } from '../database/entities/utilisateur.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UtilisateurEntity)
    private readonly usersRepository: Repository<UtilisateurEntity>,
    private readonly jwtService: JwtService,
  ) {}

  private async verifyPassword(plainPassword: string, storedPassword: string) {
    if (!storedPassword) return false;

    const looksLikeBcrypt =
      storedPassword.startsWith('$2a$') ||
      storedPassword.startsWith('$2b$') ||
      storedPassword.startsWith('$2y$');

    if (looksLikeBcrypt) {
      return bcrypt.compare(plainPassword, storedPassword);
    }

    // Fallback dev uniquement
    return plainPassword === storedPassword;
  }

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
        role: 'admin',
      },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    if (!user.actif) {
      throw new UnauthorizedException('Compte inactif');
    }

    const passwordOk = await this.verifyPassword(password, user.passwordHash);

    if (!passwordOk) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        name: `${user.prenom ?? ''} ${user.nom ?? ''}`.trim(),
        email: user.email,
        role: user.role,
      },
    };
  }
}