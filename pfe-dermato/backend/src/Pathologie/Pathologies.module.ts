import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pathologie } from './pathologie.entity';
import { PathologiesService } from './pathologies.service';
import { PathologiesController } from './pathologies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pathologie])],
  controllers: [PathologiesController],
  providers: [PathologiesService],
  exports: [PathologiesService],
})
export class PathologiesModule {}