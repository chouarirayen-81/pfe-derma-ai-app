import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entités
import { Analyse } from './analyses/analyse.entity';
import { LogAudit } from './audit/log-audit.entity';
import { RefreshToken } from './auth/Refresh-token.entity';
// ✅ Corriger tous les imports
import { Pathologie } from './Pathologie/pathologie.entity';
import { Conseil }    from './conseils/conseil.entity';
import { Notification } from './notifications/notification.entity';

import { Utilisateur } from './utilisateurs/utilisateur.entity';

// Modules fonctionnels
import { AnalysesModule } from './analyses/analyses.module';
import { AuthModule } from './auth/auth.module';
import { UtilisateursModule } from './utilisateurs/utilisateurs.module';

// Controller test
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USER', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'dermatobase'),
        entities: [
          Utilisateur,
          Analyse,
          Pathologie,
          Conseil,
          Notification,
          RefreshToken,
          LogAudit,
         
        ],
        synchronize: false,
        logging: config.get<string>('NODE_ENV') === 'development',
        charset: 'utf8mb4',
      }),
    }),
   
    AuthModule,
    UtilisateursModule,
    AnalysesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}