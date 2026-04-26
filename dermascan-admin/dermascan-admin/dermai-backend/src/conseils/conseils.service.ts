import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConseilEntity } from '../database/entities/conseil.entity';
import { PathologieEntity } from '../database/entities/pathologie.entity';

@Injectable()
export class ConseilsService {
  constructor(
    @InjectRepository(ConseilEntity)
    private readonly conseilsRepository: Repository<ConseilEntity>,
    @InjectRepository(PathologieEntity)
    private readonly pathologiesRepository: Repository<PathologieEntity>,
  ) {}

  async findAll() {
    const conseils = await this.conseilsRepository.find({
      relations: ['pathologie'],
      where: {
        actif: true,
      },
      order: {
        ordre: 'ASC',
        creeLe: 'DESC',
      },
    });

    return conseils.map((conseil) => ({
      id: conseil.id,
      title: conseil.titre,
      content: conseil.contenu,
      category: conseil.pathologie?.nom || conseil.type || 'Général',
      createdAt: conseil.creeLe,
      pathologieId: conseil.pathologieId,
      type: conseil.type,
      ordre: conseil.ordre,
      valeur: conseil.valeur,
      emoji: conseil.emoji,
    }));
  }

  async create(payload: {
    title: string;
    content: string;
    pathologieId: number;
    type?: 'prevention' | 'traitement' | 'urgence' | 'information';
    ordre?: number;
    valeur?: string;
    emoji?: string;
  }) {
    const pathologie = await this.pathologiesRepository.findOne({
      where: { id: payload.pathologieId },
    });

    if (!pathologie) {
      throw new BadRequestException('Pathologie introuvable');
    }

    const conseil = this.conseilsRepository.create({
      titre: payload.title.trim(),
      contenu: payload.content.trim(),
      pathologieId: payload.pathologieId,
      pathologie,
      type: payload.type || 'information',
      ordre: payload.ordre ?? 1,
      valeur: payload.valeur?.trim() || null,
      emoji: payload.emoji?.trim() || null,
      actif: true,
    });

    return this.conseilsRepository.save(conseil);
  }

  async update(
    id: number,
    payload: {
      title?: string;
      content?: string;
      pathologieId?: number | null;
      type?: 'prevention' | 'traitement' | 'urgence' | 'information' | null;
      ordre?: number | null;
      valeur?: string;
      emoji?: string;
    },
  ) {
    const conseil = await this.conseilsRepository.findOne({
      where: { id },
      relations: ['pathologie'],
    });

    if (!conseil) {
      throw new NotFoundException('Conseil introuvable');
    }

    if (payload.pathologieId !== undefined && payload.pathologieId !== null) {
      const pathologie = await this.pathologiesRepository.findOne({
        where: { id: payload.pathologieId },
      });

      if (!pathologie) {
        throw new BadRequestException('Pathologie introuvable');
      }

      conseil.pathologieId = payload.pathologieId;
      conseil.pathologie = pathologie;
    }

    if (payload.title !== undefined) conseil.titre = payload.title.trim();
    if (payload.content !== undefined) conseil.contenu = payload.content.trim();
    if (payload.type !== undefined) conseil.type = payload.type;
    if (payload.ordre !== undefined) conseil.ordre = payload.ordre ?? 1;
    if (payload.valeur !== undefined) conseil.valeur = payload.valeur?.trim() || null;
    if (payload.emoji !== undefined) conseil.emoji = payload.emoji?.trim() || null;

    const saved = await this.conseilsRepository.save(conseil);

    return {
      message: 'Conseil mis à jour avec succès',
      conseil: {
        id: saved.id,
        title: saved.titre,
        content: saved.contenu,
        category: saved.pathologie?.nom || saved.type || 'Général',
        createdAt: saved.creeLe,
        pathologieId: saved.pathologieId,
        type: saved.type,
        ordre: saved.ordre,
        valeur: saved.valeur,
        emoji: saved.emoji,
      },
    };
  }

  async remove(id: number) {
    const conseil = await this.conseilsRepository.findOne({
      where: { id },
    });

    if (!conseil) {
      throw new NotFoundException('Conseil introuvable');
    }

    conseil.actif = false;
    await this.conseilsRepository.save(conseil);

    return {
      message: 'Conseil supprimé avec succès',
    };
  }
}