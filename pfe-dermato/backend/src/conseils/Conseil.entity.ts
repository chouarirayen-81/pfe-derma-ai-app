// backend/src/conseils/conseil.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Pathologie } from '../Pathologie/Pathologie.entity';

@Entity('conseils')
export class Conseil {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pathologie_id' })
  pathologieId: number;

  @Column({ length: 200 })
  titre: string;

  @Column({ type: 'text' })
  contenu: string;

  @Column({
    type: 'enum',
    enum: ['prevention', 'traitement', 'urgence', 'information'],
    default: 'information',
  })
  type: string;

  @Column({ type: 'tinyint', unsigned: true, default: 1 })
  ordre: number;

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn({ name: 'cree_le' })
  creeLe: Date;

  @UpdateDateColumn({ name: 'mis_a_jour_le' })
  misAJourLe: Date;

  // ── Relation : un conseil appartient à une pathologie ──
  @ManyToOne(() => Pathologie, (pathologie) => pathologie.conseils)
  @JoinColumn({ name: 'pathologie_id' })
  pathologie: Pathologie;
}