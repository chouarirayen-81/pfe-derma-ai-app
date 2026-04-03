// backend/src/audit/log-audit.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

@Entity('logs_audit')
export class LogAudit {

  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'utilisateur_id', nullable: true })
  utilisateurId: number;

  @Column({ length: 100 })
  action: string;

  @Column({ length: 50, nullable: true })
  entite: string;

  @Column({ name: 'entite_id', nullable: true })
  entiteId: number;

  @Column({ type: 'json', nullable: true })
  details: Record<string, any>;

  @Column({ length: 45, nullable: true })
  ip: string;

  @CreateDateColumn({ name: 'cree_le' })
  creeLe: Date;
}