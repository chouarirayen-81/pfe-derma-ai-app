import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AnalyseEntity } from './analyse.entity';

@Entity({ name: 'utilisateurs' })
export class UtilisateurEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nom', type: 'varchar', length: 100 })
  nom: string;

  @Column({ name: 'prenom', type: 'varchar', length: 100 })
  prenom: string;

  @Column({ name: 'email', type: 'varchar', length: 180 })
  email: string;

  @Column({ name: 'telephone', type: 'varchar', length: 20, nullable: true })
  telephone?: string | null;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'age', type: 'tinyint', unsigned: true, nullable: true })
  age?: number | null;

  @Column({
    name: 'sexe',
    type: 'enum',
    enum: ['homme', 'femme', 'autre'],
    nullable: true,
  })
  sexe?: 'homme' | 'femme' | 'autre' | null;

  @Column({ name: 'allergies', type: 'text', nullable: true })
  allergies?: string | null;

  @Column({ name: 'photo_profil', type: 'varchar', length: 255, nullable: true })
  photoProfil?: string | null;

  @Column({
    name: 'provider',
    type: 'enum',
    enum: ['local', 'google', 'facebook'],
    default: 'local',
  })
  provider: 'local' | 'google' | 'facebook';

  @Column({ name: 'provider_id', type: 'varchar', length: 255, nullable: true })
  providerId?: string | null;

  @Column({ name: 'role', type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  @Column({ name: 'double_auth_active', type: 'tinyint', default: 0 })
  doubleAuthActive: boolean;

  @Column({ name: 'double_auth_secret', type: 'varchar', length: 64, nullable: true })
  doubleAuthSecret?: string | null;

  @Column({ name: 'email_verifie', type: 'tinyint', default: 0 })
  emailVerifie: boolean;

  @Column({ name: 'token_verification', type: 'varchar', length: 255, nullable: true })
  tokenVerification?: string | null;

  @Column({ name: 'actif', type: 'tinyint', default: 1 })
  actif: boolean;

  @Column({ name: 'temp_creation', type: 'datetime', nullable: true })
  tempCreation?: Date | null;

  @Column({ name: 'temps_modif', type: 'datetime', nullable: true })
  tempsModif?: Date | null;

  @Column({ name: 'antecedents', type: 'text', nullable: true })
  antecedents?: string | null;

  @Column({ name: 'traitements', type: 'text', nullable: true })
  traitements?: string | null;

  @Column({ name: 'duree_lesion', type: 'varchar', length: 100, nullable: true })
  dureeLesion?: string | null;

  @Column({ name: 'symptomes', type: 'text', nullable: true })
  symptomes?: string | null;

  @Column({ name: 'zone_corps', type: 'varchar', length: 100, nullable: true })
  zoneCorps?: string | null;

  @Column({ name: 'observation', type: 'text', nullable: true })
  observation?: string | null;

  @Column({ name: 'password_change_code', type: 'varchar', length: 10, nullable: true })
  passwordChangeCode?: string | null;

  @Column({ name: 'password_change_code_expires_at', type: 'timestamp', nullable: true })
  passwordChangeCodeExpiresAt?: Date | null;

  @Column({ name: 'pending_email', type: 'varchar', length: 180, nullable: true })
  pendingEmail?: string | null;

  @Column({ name: 'pending_email_code', type: 'varchar', length: 10, nullable: true })
  pendingEmailCode?: string | null;

  @Column({ name: 'pending_email_code_expires_at', type: 'timestamp', nullable: true })
  pendingEmailCodeExpiresAt?: Date | null;

  @Column({ name: 'password_reset_code_hash', type: 'varchar', length: 255, nullable: true })
  passwordResetCodeHash?: string | null;

  @Column({ name: 'password_reset_expires_at', type: 'datetime', nullable: true })
  passwordResetExpiresAt?: Date | null;

  @OneToMany(() => AnalyseEntity, (analyse) => analyse.utilisateur)
  analyses: AnalyseEntity[];
}