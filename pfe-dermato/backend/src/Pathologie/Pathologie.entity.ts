// backend/src/pathologies/pathologie.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, OneToMany,
} from 'typeorm';
import { Conseil } from '../conseils/Conseil.entity';

@Entity('pathologies')
export class Pathologie {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  code: string; // ex: "acne", "eczema"

  @Column({ length: 150 })
  nom: string; // ex: "Acné vulgaire"

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['faible', 'moderee', 'elevee'],
    default: 'faible',
  })
  gravite: string;

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn({ name: 'cree_le' })
  creeLe: Date;

  // ── Relation : une pathologie a plusieurs conseils ──
  @OneToMany(() => Conseil, (conseil) => conseil.pathologie)
  conseils: Conseil[];
}