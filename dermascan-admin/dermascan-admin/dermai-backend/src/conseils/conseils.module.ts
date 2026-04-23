import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConseilsController } from './conseils.controller';
import { ConseilsService } from './conseils.service';
import { ConseilEntity } from '../database/entities/conseil.entity';
import { PathologieEntity } from '../database/entities/pathologie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConseilEntity, PathologieEntity])],
  controllers: [ConseilsController],
  providers: [ConseilsService],
})
export class ConseilsModule {}