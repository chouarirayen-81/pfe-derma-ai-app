import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entités (une par table)
import { Analyse } from './analyses/analyse.entity';
import { LogAudit } from './audit/log-audit.entity';
import { RefreshToken } from './auth/Refresh-token.entity';
import { Conseil } from './conseils/Conseil.entity';
import { Notification } from './notifications/notification.entity';
import { Pathologie } from './Pathologie/Pathologie.entity';
import { Utilisateur } from './utilisateurs/utilisateur.entity';

// Modules fonctionnels
import { AnalysesModule } from './analyses/analyses.module';
import { AuthModule } from './auth/auth.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';

@Module({
  imports: [
    // ── 1. Variables d'environnement (.env) ──
    ConfigModule.forRoot({ isGlobal: true }),

    // ── 2. Connexion MySQL via TypeORM ──
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject:  [ConfigService],
      useFactory: (config: ConfigService) => ({
        type:     'mysql',
        host:     config.get<string>('DB_HOST',     'localhost'),
        port:     config.get<number>('DB_PORT',     3306),
        username: config.get<string>('DB_USER',     'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME',     'dermatobase'),
        entities: [
          Utilisateur,
          Analyse,
          Pathologie,
          Conseil,
          Notification,
          RefreshToken,
          LogAudit,
        ],
        synchronize: false, // ⚠️ false en prod — la DB est déjà créée via SQL
        logging:     config.get<string>('NODE_ENV') === 'development',
        charset:     'utf8mb4',
      }),
    }),

    // ── 3. Modules fonctionnels ──
    AuthModule,
    UtilisateursModule,
    AnalysesModule,
  ],
})
export class AppModule {}