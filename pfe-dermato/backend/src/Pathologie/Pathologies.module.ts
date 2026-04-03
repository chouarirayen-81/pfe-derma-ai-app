// backend/src/pathologies/pathologies.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pathologie } from './Pathologie.entity';
import { PathologiesService }    from './Pathologie.service';
import { PathologiesController } from './pathologies.controller';

@Module({
  imports:     [TypeOrmModule.forFeature([Pathologie])],
  controllers: [PathologiesController],
  providers:   [PathologiesService],
  exports:     [PathologiesService], // exporté pour être utilisé dans AnalysesModule
})
export class PathologiesModule {}