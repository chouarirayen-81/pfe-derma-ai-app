// backend/src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Utilisateur } from '../utilisateurs/utilisateur.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Utilisateur)
    private utilisateurRepo: Repository<Utilisateur>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'dermascan_secret_key_2024',
    });
  }

  async validate(payload: { sub: number; email: string; role: string }) {
    const user = await this.utilisateurRepo.findOne({
      where: { id: payload.sub, actif: true },
    });
    if (!user) throw new UnauthorizedException();
    return { userId: user.id, email: user.email, role: user.role };
  }
}