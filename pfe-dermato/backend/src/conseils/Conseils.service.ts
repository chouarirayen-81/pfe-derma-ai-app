import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conseil } from './conseil.entity';

@Injectable()
export class ConseilsService {
  constructor(
    @InjectRepository(Conseil)
    private readonly conseilRepo: Repository<Conseil>,
  ) {}

  // ── Tous les conseils actifs
  async findAll() {
    return this.conseilRepo.find({
      where: { actif: true },
      order: { type: 'ASC', ordre: 'ASC' },
      relations: ['pathologie'],
    });
  }

  // ── Stats
  async getStats(pathologieId?: number) {
    const where: any = { actif: true };

    if (typeof pathologieId === 'number' && !Number.isNaN(pathologieId)) {
      where.pathologieId = pathologieId;
    }

    const conseils = await this.conseilRepo.find({ where });

    const parType = conseils.reduce((acc, conseil) => {
      acc[conseil.type] = (acc[conseil.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: conseils.length,
      categories: Object.keys(parType).length,
      parType,
    };
  }

  // ── Tips généraux accueil
  async getTips(limit: number) {
    const tips = await this.conseilRepo.find({
      where: { type: 'information', actif: true },
      order: { ordre: 'ASC' },
      take: limit,
      relations: ['pathologie'],
    });

    return tips.map((tip, index) => ({
      id: tip.id,
      titre: tip.titre,
      valeur: tip.valeur || tip.contenu || '',
      emoji:
        tip.emoji ||
        ['💧', '🥗', '😴', '💡', '🛡️'][index % 5],
    }));
  }

  // ── Conseils selon pathologie
  async findByPathologie(pathologieId: number) {
    return this.conseilRepo.find({
      where: { pathologieId, actif: true },
      order: { ordre: 'ASC' },
      relations: ['pathologie'],
    });
  }

  // ── Conseils urgents d'une pathologie
  async findUrgents(pathologieId: number) {
    return this.conseilRepo.find({
      where: { pathologieId, type: 'urgence', actif: true },
      order: { ordre: 'ASC' },
      relations: ['pathologie'],
    });
  }

  // ── Détail d’un conseil
  async findOne(id: number): Promise<Conseil> {
    const conseil = await this.conseilRepo.findOne({
      where: { id, actif: true },
      relations: ['pathologie'],
    });

    if (!conseil) {
      throw new NotFoundException(`Conseil #${id} introuvable`);
    }

    return conseil;
  }

  // ── Création
  async create(data: {
    pathologieId?: number | null;
    titre: string;
    contenu: string;
    type: 'prevention' | 'traitement' | 'urgence' | 'information';
    ordre?: number;
    valeur?: string | null;
    emoji?: string | null;
  }): Promise<Conseil> {
    const conseil = this.conseilRepo.create({
      ...data,
      ordre: data.ordre ?? 1,
      actif: true,
    });

    return this.conseilRepo.save(conseil);
  }

  // ── Modification
  async update(id: number, data: Partial<Conseil>): Promise<Conseil> {
    await this.conseilRepo.update(id, data);
    return this.findOne(id);
  }

  // ── Soft delete
  async supprimer(id: number): Promise<{ message: string }> {
    await this.conseilRepo.update(id, { actif: false });
    return { message: `Conseil #${id} supprimé` };
  }
}