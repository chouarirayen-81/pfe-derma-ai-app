import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConseilsModule } from './conseils/conseils.module';
import { StatsModule } from './stats/stats.module';
import { AnalysesModule } from './analyses/analyses.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConseilsModule,
    StatsModule,
    AnalysesModule,
  ],
})
export class AppModule {}