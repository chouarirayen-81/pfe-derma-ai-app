import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pathologie } from './pathologie.entity';

@Injectable()
export class PathologiesService {
  constructor(
    @InjectRepository(Pathologie)
    private pathologieRepo: Repository<Pathologie>,
  ) {}

  async findAll(): Promise<Pathologie[]> {
    return this.pathologieRepo.find({
      where: { actif: true },
      order: { nom: 'ASC' },
      relations: ['conseils'],
    });
  }

  async findOne(id: number): Promise<Pathologie> {
    const pathologie = await this.pathologieRepo.findOne({
      where: { id, actif: true },
      relations: ['conseils'],
    });

    if (!pathologie) {
      throw new NotFoundException(`Pathologie #${id} introuvable`);
    }

    return pathologie;
  }

  async findByCode(code: string): Promise<Pathologie> {
    const pathologie = await this.pathologieRepo.findOne({
      where: { code, actif: true },
      relations: ['conseils'],
    });

    if (!pathologie) {
      throw new NotFoundException(`Pathologie code "${code}" introuvable`);
    }

    return pathologie;
  }

  async create(data: {
    code: string;
    nom: string;
    description?: string;
    gravite: 'faible' | 'moderee' | 'elevee';
  }): Promise<Pathologie> {
    const pathologie = this.pathologieRepo.create(data);
    return this.pathologieRepo.save(pathologie);
  }

  async update(id: number, data: Partial<Pathologie>): Promise<Pathologie> {
    await this.pathologieRepo.update(id, data);
    return this.findOne(id);
  }

  async desactiver(id: number): Promise<{ message: string }> {
    await this.pathologieRepo.update(id, { actif: false });
    return { message: `Pathologie #${id} désactivée` };
  }
}