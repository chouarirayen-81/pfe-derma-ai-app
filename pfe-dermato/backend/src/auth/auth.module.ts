// backend/src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController }  from './auth.controller';
import { AuthService }     from './auth.service';
import { JwtStrategy }     from './Jwt.strategy';
import { Utilisateur }     from '../utilisateurs/utilisateur.entity';
import { RefreshToken }    from './Refresh-token.entity';
import { MailService } from '../utilisateurs/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Utilisateur, RefreshToken]),
    PassportModule,
    JwtModule.registerAsync({
      imports:    [ConfigModule],
      inject:     [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:      config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '15m') },
      }),
    }),
    JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: '1h',
    },
  }),
}),
  ],
  controllers: [AuthController],
  providers:   [AuthService, JwtStrategy, MailService],
  exports:     [AuthService],
})

export class AuthModule {}