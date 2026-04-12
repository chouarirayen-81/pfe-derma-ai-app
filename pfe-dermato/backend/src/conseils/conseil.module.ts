import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conseil } from './conseil.entity';
import { ConseilsService } from './conseils.service';
import { ConseilsController } from './Conseils.controller';
import { Pathologie } from '../Pathologie/pathologie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conseil, Pathologie])],
  controllers: [ConseilsController],
  providers: [ConseilsService],
  exports: [ConseilsService],
})
export class ConseilsModule {}