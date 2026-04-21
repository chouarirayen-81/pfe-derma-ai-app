import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Pathologie } from '../Pathologie/pathologie.entity';

export type ConseilType =
  | 'prevention'
  | 'traitement'
  | 'urgence'
  | 'information';

@Entity('conseils')
export class Conseil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pathologie_id', type: 'int', nullable: true })
  pathologieId: number | null;

  @ManyToOne(() => Pathologie, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'pathologie_id' })
  pathologie: Pathologie | null;

  @Column({ type: 'varchar', length: 255 })
  titre: string;

  @Column({ type: 'text' })
  contenu: string;

  @Column({
    type: 'enum',
    enum: ['prevention', 'traitement', 'urgence', 'information'],
    default: 'information',
  })
  type: ConseilType;

  @Column({ type: 'int', default: 1 })
  ordre: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  valeur: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emoji: string | null;

  @Column({ type: 'boolean', default: true })
  actif: boolean;

  @CreateDateColumn({ name: 'cree_le' })
  creeLe: Date;

  @UpdateDateColumn({ name: 'mis_a_jour_le' })
  misAJourLe: Date;
}