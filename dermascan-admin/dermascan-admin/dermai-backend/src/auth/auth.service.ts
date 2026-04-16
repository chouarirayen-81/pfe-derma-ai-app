import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(email: string, password: string) {
    if (email !== 'admin@test.com' || password !== '123456') {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const user = {
      id: 1,
      name: 'Admin DermAI',
      email,
      role: 'admin',
    };

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user,
    };
  }
}