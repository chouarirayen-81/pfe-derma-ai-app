import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Conseil } from '../conseils/conseil.entity';

@Entity('pathologies')
export class Pathologie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 150 })
  nom: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['faible', 'moderee', 'elevee'],
    default: 'faible',
  })
  gravite: 'faible' | 'moderee' | 'elevee';

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn({ name: 'cree_le' })
  creeLe: Date;

  @OneToMany(() => Conseil, (conseil) => conseil.pathologie)
  conseils: Conseil[];
}