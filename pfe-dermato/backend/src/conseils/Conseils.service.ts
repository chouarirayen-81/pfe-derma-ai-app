// backend/src/conseils/conseils.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conseil } from './Conseil.entity';

@Injectable()
export class ConseilsService {
  constructor(
    @InjectRepository(Conseil)
    private conseilRepo: Repository<Conseil>,
  ) {}

  // ── Tous les conseils d'une pathologie ──
  // Utilisé après l'analyse IA pour afficher les conseils
  async findByPathologie(pathologieId: number): Promise<Conseil[]> {
    return this.conseilRepo.find({
      where: { pathologieId, actif: true },
      order: { ordre: 'ASC' },
    });
  }

  // ── Conseils urgents uniquement ──
  // Utilisé quand niveau_urgence = 'urgence'
  async findUrgents(pathologieId: number): Promise<Conseil[]> {
    return this.conseilRepo.find({
      where: { pathologieId, type: 'urgence', actif: true },
      order: { ordre: 'ASC' },
    });
  }


  async getTips(limit: number) {
  return this.conseilRepo.find({
    where: { type: 'information' },
    order: { ordre: 'ASC' },
    take: limit,
    select: ['id', 'titre', 'valeur', 'emoji'],
  });
}


  // ── Détail d'un conseil ──
  async findOne(id: number): Promise<Conseil> {
    const conseil = await this.conseilRepo.findOne({
      where:     { id, actif: true },
      relations: ['pathologie'],
    });
    if (!conseil) throw new NotFoundException(`Conseil #${id} introuvable`);
    return conseil;
  }

  // ── Créer un conseil (admin) ──
  async create(data: {
    pathologieId: number;
    titre: string;
    contenu: string;
    type: 'prevention' | 'traitement' | 'urgence' | 'information';
    ordre?: number;
  }): Promise<Conseil> {
    const conseil = this.conseilRepo.create(data);
    return this.conseilRepo.save(conseil);
  }

  // ── Modifier un conseil (admin) ──
  async update(id: number, data: Partial<Conseil>): Promise<Conseil> {
    await this.conseilRepo.update(id, data);
    return this.findOne(id);
  }

  // ── Supprimer un conseil (admin) ──
  async supprimer(id: number): Promise<{ message: string }> {
    await this.conseilRepo.update(id, { actif: false });
    return { message: `Conseil #${id} supprimé` };
  }
}