// backend/src/utilisateurs/utilisateur.entity.ts
// TypeORM mappe automatiquement cette classe à la table MySQL `utilisateurs`

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Analyse }      from '../analyses/analyse.entity';
import { Notification } from '../notifications/notification.entity';
import { RefreshToken } from '../auth/Refresh-token.entity';

@Entity('utilisateurs') // ← nom exact de la table MySQL
export class Utilisateur {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nom: string;

  @Column({ length: 100 })
  prenom: string;

  @Column({ length: 180, unique: true })
  email: string;

  @Column({ length: 20, nullable: true })
  telephone: string;

  @Column({ name: 'password_hash', length: 255 })
  @Exclude() // ← ne jamais renvoyer le hash dans les réponses API
  passwordHash: string;

  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  age: number;

  @Column({
    type: 'enum',
    enum: ['homme', 'femme', 'autre'],
    nullable: true,
  })
  sexe: string;

  @Column({ type: 'text', nullable: true })
  allergies: string;

  @Column({ name: 'photo_profil', nullable: true })
  photoProfil: string;

  @Column({
    type: 'enum',
    enum: ['local', 'google', 'facebook'],
    default: 'local',
  })
  provider: string;

  @Column({ name: 'provider_id', nullable: true })
  providerId: string;

  @Column({
    type: 'enum',
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: string;

  @Column({ name: 'double_auth_active', default: false })
  doubleAuthActive: boolean;

  @Column({ name: 'double_auth_secret', nullable: true })
  @Exclude()
  doubleAuthSecret: string;

  @Column({ name: 'email_verifie', default: false })
  emailVerifie: boolean;

  @Column({ name: 'token_verification', nullable: true })
  @Exclude()
  tokenVerification: string;

  @Column({ default: true })
  actif: boolean;

  @CreateDateColumn({ name: 'temp_creation' })
  tempCreation: Date;

  @UpdateDateColumn({ name: 'temps_modif' })
  tempsModif: Date;

  // ── Relations ──
  @OneToMany(() => Analyse, (analyse) => analyse.utilisateur)
  analyses: Analyse[];

  @OneToMany(() => Notification, (notif) => notif.utilisateur)
  notifications: Notification[];

  @OneToMany(() => RefreshToken, (token) => token.utilisateur)
  refreshTokens: RefreshToken[];
}