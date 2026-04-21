import { Module }          from '@nestjs/common';
import { TypeOrmModule }   from '@nestjs/typeorm';
import { HttpModule }      from '@nestjs/axios';
import { MulterModule }    from '@nestjs/platform-express';
import { memoryStorage }   from 'multer';
import { Analyse }             from './analyse.entity';
import { AnalysesService } from './analyses.service';
import { AnalysesController }  from './analyses.controller';
 import { ConfigModule } from '@nestjs/config';
import { Pathologie } from '../Pathologie/pathologie.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Analyse, Pathologie]),
 
    // HttpModule pour appeler le microservice IA FastAPI
    HttpModule.register({ timeout: 30000 }),
 
    // Multer pour recevoir les images (stockage en mémoire)
    MulterModule.register({
      storage: memoryStorage(),
      limits:  { fileSize: 10 * 1024 * 1024 }, // max 10MB
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          cb(new Error('Seules les images JPG/PNG/WEBP sont acceptées'), false);
        } else {
          cb(null, true);
        }
      },
    }),
    ConfigModule,
  ],
  controllers: [AnalysesController],
  providers:   [AnalysesService],
  exports:     [AnalysesService],
})
export class AnalysesModule {}