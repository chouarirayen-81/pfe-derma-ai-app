// backend/src/notifications/notification.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Utilisateur } from '../utilisateurs/utilisateur.entity';

@Entity('notifications')
export class Notification {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'utilisateur_id' })
  utilisateurId: number;

  @Column({
    type: 'enum',
    enum: ['analyse_terminee', 'avertissement_ia', 'rappel_checkup', 'systeme'],
  })
  type: string;

  @Column({ length: 200 })
  titre: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  lue: boolean;

  @Column({ name: 'analyse_id', nullable: true })
  analyseId: number;

  @CreateDateColumn({ name: 'cree_le' })
  creeLe: Date;

  @ManyToOne(() => Utilisateur, (user) => user.notifications)
  @JoinColumn({ name: 'utilisateur_id' })
  utilisateur: Utilisateur;
}