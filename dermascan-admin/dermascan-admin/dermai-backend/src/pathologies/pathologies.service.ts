import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PathologieEntity } from '../database/entities/pathologie.entity';

@Injectable()
export class PathologiesService {
  constructor(
    @InjectRepository(PathologieEntity)
    private readonly pathologiesRepository: Repository<PathologieEntity>,
  ) {}

  async findAll() {
    return this.pathologiesRepository.find({
      where: { actif: true },
      order: { nom: 'ASC' },
    });
  }

  async create(payload: {
    code: string;
    nom: string;
    description?: string;
    gravite?: 'faible' | 'moderee' | 'elevee';
  }) {
    const existing = await this.pathologiesRepository.findOne({
      where: [{ code: payload.code }, { nom: payload.nom }],
    });

    if (existing) {
      throw new BadRequestException('Cette pathologie existe déjà');
    }

    const entity = this.pathologiesRepository.create({
      code: payload.code.trim(),
      nom: payload.nom.trim(),
      description: payload.description?.trim() || null,
      gravite: payload.gravite || 'faible',
      actif: true,
    });

    return this.pathologiesRepository.save(entity);
  }
}