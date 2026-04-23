import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConseilsModule } from './conseils/conseils.module';
import { StatsModule } from './stats/stats.module';
import { AnalysesModule } from './analyses/analyses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST') || '127.0.0.1',
        port: Number(config.get<string>('DB_PORT') || 3306),
        username: config.get<string>('DB_USERNAME') || 'root',
        password: config.get<string>('DB_PASSWORD') || '',
        database: config.get<string>('DB_NAME') || 'dermatobase',
        autoLoadEntities: true,
        synchronize: false,
        logging: false,
      }),
    }),

    AuthModule,
    UsersModule,
    ConseilsModule,
    StatsModule,
    AnalysesModule,
  ],
})
export class AppModule {}