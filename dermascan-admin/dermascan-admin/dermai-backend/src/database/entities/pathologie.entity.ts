import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ConseilEntity } from './conseil.entity';

@Entity({ name: 'pathologies' })
export class PathologieEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'code', type: 'varchar', length: 50 })
  code!: string;

  @Column({ name: 'nom', type: 'varchar', length: 150 })
  nom!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string | null;

  @Column({
    name: 'gravite',
    type: 'enum',
    enum: ['faible', 'moderee', 'elevee'],
    default: 'faible',
    nullable: true,
  })
  gravite?: 'faible' | 'moderee' | 'elevee' | null;

  @Column({ name: 'actif', type: 'tinyint', default: 1 })
  actif!: boolean;

  @Column({ name: 'cree_le', type: 'datetime', nullable: true })
  creeLe?: Date | null;

  @OneToMany(() => ConseilEntity, (conseil) => conseil.pathologie)
  conseils!: ConseilEntity[];
}