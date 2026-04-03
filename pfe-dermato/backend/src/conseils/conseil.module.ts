// backend/src/conseils/conseils.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conseil } from './Conseil.entity';
import { ConseilsService }    from './Conseils.service';
import { ConseilsController } from './Conseils.controller';

@Module({
  imports:     [TypeOrmModule.forFeature([Conseil])],
  controllers: [ConseilsController],
  providers:   [ConseilsService],
  exports:     [ConseilsService], // exporté pour AnalysesModule
})
export class ConseilsModule {}