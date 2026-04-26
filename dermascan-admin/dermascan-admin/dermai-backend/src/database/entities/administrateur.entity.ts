import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'administrateurs' })
export class AdministrateurEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nom', type: 'varchar', length: 100 })
  nom!: string;

  @Column({ name: 'prenom', type: 'varchar', length: 100 })
  prenom!: string;

  @Column({ name: 'email', type: 'varchar', length: 180, unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ name: 'actif', type: 'tinyint', default: 1 })
  actif!: boolean;

  @Column({ name: 'cree_le', type: 'datetime', nullable: true })
  creeLe?: Date | null;

  @Column({ name: 'mis_a_jour_le', type: 'datetime', nullable: true })
  misAJourLe?: Date | null;
}