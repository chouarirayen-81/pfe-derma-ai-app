import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Pathologie } from '../Pathologie/pathologie.entity';
export type TypeConseil =
  | 'prevention'
  | 'traitement'
  | 'urgence'
  | 'information';

@Entity('conseils')
export class Conseil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  pathologieId: number;

  @ManyToOne(() => Pathologie, (pathologie) => pathologie.conseils, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'pathologieId' })
  pathologie: Pathologie | null;

  @Column()
  titre: string;

  @Column('text')
  contenu: string;

  @Column({
    type: 'enum',
    enum: ['prevention', 'traitement', 'urgence', 'information'],
    default: 'information',
  })
  type: TypeConseil;

  @Column({ default: 0 })
  ordre: number;

  @Column({ nullable: true })
  valeur: string;

  @Column({ nullable: true })
  emoji: string;

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn()
  creeLe: Date;
}