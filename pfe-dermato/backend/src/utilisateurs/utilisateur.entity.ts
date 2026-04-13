import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Analyse } from '../analyses/analyse.entity';
import { Notification } from '../notifications/notification.entity';
import { RefreshToken } from '../auth/Refresh-token.entity';

@Entity('utilisateurs')
export class Utilisateur {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nom!: string;

  @Column({ length: 100 })
  prenom!: string;

  @Column({ length: 180, unique: true })
  email!: string;

  @Column({ length: 20, nullable: true })
  telephone?: string;

  @Column({ name: 'password_hash', length: 255 })
  @Exclude()
  passwordHash!: string;

  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  age?: number;

  @Column({
    type: 'enum',
    enum: ['homme', 'femme', 'autre'],
    nullable: true,
  })
  sexe?: 'homme' | 'femme' | 'autre';

  @Column({ type: 'text', nullable: true })
  allergies?: string;

  @Column({ type: 'text', nullable: true })
  antecedents?: string;

  @Column({ type: 'text', nullable: true })
  traitements?: string;

  @Column({ name: 'duree_lesion', type: 'varchar', length: 100, nullable: true })
  dureeLesion?: string;

  @Column({ type: 'text', nullable: true })
  symptomes?: string;

  @Column({ name: 'zone_corps', type: 'varchar', length: 100, nullable: true })
  zoneCorps?: string;

  @Column({ type: 'text', nullable: true })
  observation?: string;

  @Column({ name: 'photo_profil', nullable: true })
  photoProfil?: string;

  @Column({
    type: 'enum',
    enum: ['local', 'google', 'facebook'],
    default: 'local',
  })
  provider!: string;

  @Column({ name: 'provider_id', nullable: true })
  providerId?: string;

  @Column({
    type: 'enum',
    enum: ['user', 'admin'],
    default: 'user',
  })
  role!: string;

  @Column({ name: 'double_auth_active', default: false })
  doubleAuthActive!: boolean;

  @Column({ name: 'double_auth_secret', nullable: true })
  @Exclude()
  doubleAuthSecret?: string;

  @Column({ name: 'email_verifie', default: false })
  emailVerifie!: boolean;

  @Column({ name: 'token_verification', nullable: true })
  @Exclude()
  tokenVerification?: string;

 @Column({
  name: 'password_reset_code_hash',
  type: 'varchar',
  length: 255,
  nullable: true,
  select: false,
})
@Exclude()
passwordResetCodeHash!: string | null;

@Column({
  name: 'password_reset_expires_at',
  type: 'datetime',
  nullable: true,
  select: false,
})
@Exclude()
passwordResetExpiresAt!: Date | null;

  @Column({ default: true })
  actif!: boolean;

  @CreateDateColumn({ name: 'temp_creation' })
  tempCreation!: Date;

  @UpdateDateColumn({ name: 'temps_modif' })
  tempsModif!: Date;

  @OneToMany(() => Analyse, (analyse) => analyse.utilisateur)
  analyses!: Analyse[];

  @OneToMany(() => Notification, (notif) => notif.utilisateur)
  notifications!: Notification[];

  @OneToMany(() => RefreshToken, (token) => token.utilisateur)
  refreshTokens!: RefreshToken[];
}