import { Module } from '@nestjs/common';
import { ConseilsController } from './conseils.controller';
import { ConseilsService } from './conseils.service';

@Module({
  controllers: [ConseilsController],
  providers: [ConseilsService],
})
export class ConseilsModule {}