import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AdministrateurEntity } from '../database/entities/administrateur.entity';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(AdministrateurEntity)
    private readonly adminsRepository: Repository<AdministrateurEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(payload: {
    nom: string;
    prenom: string;
    email: string;
    password: string;
  }) {
    const existing = await this.adminsRepository.findOne({
      where: { email: payload.email },
    });

    if (existing) {
      throw new BadRequestException('Cet email admin existe déjà');
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const admin = this.adminsRepository.create({
      nom: payload.nom.trim(),
      prenom: payload.prenom.trim(),
      email: payload.email.trim(),
      passwordHash,
      actif: true,
    });

    const saved = await this.adminsRepository.save(admin);

    return {
      message: 'Administrateur créé avec succès',
      admin: {
        id: saved.id,
        nom: saved.nom,
        prenom: saved.prenom,
        email: saved.email,
      },
    };
  }

  async login(email: string, password: string) {
    const admin = await this.adminsRepository.findOne({
      where: { email },
    });

    if (!admin || !admin.actif) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);

    if (!ok) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      role: 'admin',
      scope: 'dashboard_admin',
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      admin: {
        id: admin.id,
        name: `${admin.prenom} ${admin.nom}`,
        email: admin.email,
        role: 'admin',
      },
    };
  }
}