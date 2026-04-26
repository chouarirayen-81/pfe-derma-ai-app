import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PathologiesController } from './pathologies.controller';
import { PathologiesService } from './pathologies.service';
import { PathologieEntity } from '../database/entities/pathologie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PathologieEntity])],
  controllers: [PathologiesController],
  providers: [PathologiesService],
})
export class PathologiesModule {}