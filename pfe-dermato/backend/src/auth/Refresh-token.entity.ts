// backend/src/auth/refresh-token.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Utilisateur } from '../utilisateurs/utilisateur.entity';

@Entity('refresh_tokens')
export class RefreshToken {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'utilisateur_id' })
  utilisateurId: number;

  @Column({ length: 512, unique: true })
  token: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ default: false })
  revoque: boolean;

  @Column({ name: 'ip_creation', nullable: true })
  ipCreation: string;

  @CreateDateColumn({ name: 'cree_le' })
  creeLe: Date;

  @ManyToOne(() => Utilisateur, (user) => user.refreshTokens)
  @JoinColumn({ name: 'utilisateur_id' })
  utilisateur: Utilisateur;
}