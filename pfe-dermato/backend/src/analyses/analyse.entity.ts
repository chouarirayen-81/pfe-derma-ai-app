// backend/src/analyses/analyse.entity.ts

import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { Utilisateur } from '../utilisateurs/utilisateur.entity';

@Entity('analyses')
export class Analyse {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'utilisateur_id' })
  utilisateurId: number;

  // ── Image ──
  @Column({ name: 'image_path', length: 255 })
  imagePath: string;

  @Column({ name: 'image_miniature', nullable: true })
  imageMiniature: string;

  @Column({ name: 'image_hash', length: 64, nullable: true })
  imageHash: string;

  @Column({ name: 'qualite_score', type: 'float', nullable: true })
  qualiteScore: number;

  @Column({ name: 'qualite_ok', default: true })
  qualiteOk: boolean;

  @Column({ name: 'metadata_supprimees', default: false })
  metadataSupprimees: boolean;

  // ── Résultats IA ──
  @Column({
    type: 'enum',
    enum: ['en_attente', 'en_cours', 'termine', 'erreur'],
    default: 'en_attente',
  }) 
  statut: string;

  @Column({ name: 'classe_predite', length: 100, nullable: true })
  classePredite: string;

  @Column({ name: 'score_confiance', type: 'float', nullable: true })
  scoreConfiance: number;

  @Column({ name: 'resultats_complets', type: 'json', nullable: true })
  resultatsComplets: Record<string, number>; // { "acne": 87.5, "eczema": 8.2 }

  @Column({ name: 'modele_version', length: 50, nullable: true })
  modeleVersion: string;

  @Column({ name: 'duree_inference_ms', nullable: true })
  dureeInferenceMs: number;

  @Column({ name: 'message_erreur', type: 'text', nullable: true })
  messageErreur: string;

  // ── Recommandation ──
  @Column({
    name: 'niveau_urgence',
    type: 'enum',
    enum: ['rassurant', 'consulter', 'urgence'],
    nullable: true,
  })
  niveauUrgence: string;

  @Column({ type: 'text', nullable: true })
  conseils: string;

  @Column({ default: false })
  supprime: boolean;

  @Column({ name: 'pathologie_id', type: 'int', nullable: true })
pathologieId: number | null;


  @CreateDateColumn({ name: 'cree_le' })
  creeLe: Date;

  @UpdateDateColumn({ name: 'mis_a_jour_le' })
  misAJourLe: Date;

  // ── Relation ──
  @ManyToOne(() => Utilisateur, (user) => user.analyses)
  @JoinColumn({ name: 'utilisateur_id' })
  utilisateur: Utilisateur;
}