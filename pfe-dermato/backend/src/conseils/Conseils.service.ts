import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conseil } from './conseil.entity';

@Injectable()
export class ConseilsService {
  constructor(
    @InjectRepository(Conseil)
    private conseilRepo: Repository<Conseil>,
  ) {}

  // ── Tous les conseils actifs ────────────────────────────────────────────────
  async findAll() {
    return this.conseilRepo.find({
      where: { actif: true },
      order: { type: 'ASC', ordre: 'ASC' },
      relations: ['pathologie'],
    });
  }

  // ── Stats depuis la base ───────────────────────────────────────────────────
  async getStats(pathologieId?: number) {
    const where: any = { actif: true };

    if (pathologieId && !Number.isNaN(pathologieId)) {
      where.pathologieId = pathologieId;
    }

    const conseils = await this.conseilRepo.find({ where });

    const parType = conseils.reduce((acc, conseil) => {
      acc[conseil.type] = (acc[conseil.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categories = Object.keys(parType).length;

    return {
      total: conseils.length,
      categories,
      parType,
    };
  }

  // ── Tips généraux pour page accueil ────────────────────────────────────────
  async getTips(limit: number) {
    return this.conseilRepo.find({
      where: { type: 'information', actif: true },
      order: { ordre: 'ASC' },
      take: limit,
      select: ['id', 'titre', 'valeur', 'emoji'],
    });
  }

  // ── Conseils selon pathologie ──────────────────────────────────────────────
  async findByPathologie(pathologieId: number) {
    // Si 0 ou vide → conseils généraux de prévention
    if (!pathologieId) {
      return this.conseilRepo.find({
        where: { actif: true, type: 'prevention' },
        order: { ordre: 'ASC' },
        take: 5,
        relations: ['pathologie'],
      });
    }

    return this.conseilRepo.find({
      where: { pathologieId, actif: true },
      order: { ordre: 'ASC' },
      relations: ['pathologie'],
    });
  }

  // ── Conseils urgents d'une pathologie ──────────────────────────────────────
  async findUrgents(pathologieId: number) {
    return this.conseilRepo.find({
      where: { pathologieId, type: 'urgence', actif: true },
      order: { ordre: 'ASC' },
      relations: ['pathologie'],
    });
  }

  // ── Détail d’un conseil ────────────────────────────────────────────────────
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

  // ── Création ───────────────────────────────────────────────────────────────
  async create(data: {
    pathologieId: number;
    titre: string;
    contenu: string;
    type: 'prevention' | 'traitement' | 'urgence' | 'information';
    ordre?: number;
    valeur?: string;
    emoji?: string;
  }): Promise<Conseil> {
    const conseil = this.conseilRepo.create(data);
    return this.conseilRepo.save(conseil);
  }

  // ── Modification ───────────────────────────────────────────────────────────
  async update(id: number, data: Partial<Conseil>): Promise<Conseil> {
    await this.conseilRepo.update(id, data);
    return this.findOne(id);
  }

  // ── Soft delete ────────────────────────────────────────────────────────────
  async supprimer(id: number): Promise<{ message: string }> {
    await this.conseilRepo.update(id, { actif: false });
    return { message: `Conseil #${id} supprimé` };
  }
}