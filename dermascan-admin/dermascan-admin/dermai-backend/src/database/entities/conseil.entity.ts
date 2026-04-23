import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PathologieEntity } from './pathologie.entity';

@Entity({ name: 'conseils' })
export class ConseilEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'pathologie_id', type: 'int' })
  pathologieId: number;

  @ManyToOne(() => PathologieEntity, (pathologie) => pathologie.conseils, {
    nullable: false,
  })
  @JoinColumn({ name: 'pathologie_id' })
  pathologie: PathologieEntity;

  @Column({ name: 'titre', type: 'varchar', length: 200 })
  titre: string;

  @Column({ name: 'contenu', type: 'text' })
  contenu: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: ['prevention', 'traitement', 'urgence', 'information'],
    nullable: true,
    default: 'information',
  })
  type?: 'prevention' | 'traitement' | 'urgence' | 'information' | null;

  @Column({ name: 'ordre', type: 'tinyint', unsigned: true, nullable: true, default: 1 })
  ordre?: number | null;

  @Column({ name: 'valeur', type: 'varchar', length: 100, nullable: true })
  valeur?: string | null;

  @Column({ name: 'emoji', type: 'varchar', length: 20, nullable: true })
  emoji?: string | null;

  @Column({ name: 'actif', type: 'tinyint', default: 1 })
  actif: boolean;

  @Column({ name: 'cree_le', type: 'datetime', nullable: true })
  creeLe?: Date | null;

  @Column({ name: 'mis_a_jour_le', type: 'datetime', nullable: true })
  misAJourLe?: Date | null;
}