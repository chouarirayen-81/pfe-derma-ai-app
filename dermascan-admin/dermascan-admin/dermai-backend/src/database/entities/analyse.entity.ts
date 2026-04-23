import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UtilisateurEntity } from './utilisateur.entity';

@Entity({ name: 'analyses' })
export class AnalyseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'utilisateur_id', type: 'int' })
  utilisateurId: number;

  @ManyToOne(() => UtilisateurEntity, (utilisateur) => utilisateur.analyses, {
    nullable: false,
  })
  @JoinColumn({ name: 'utilisateur_id' })
  utilisateur: UtilisateurEntity;

  @Column({ name: 'image_path', type: 'varchar', length: 255 })
  imagePath: string;

  @Column({ name: 'image_miniature', type: 'varchar', length: 255, nullable: true })
  imageMiniature?: string;

  @Column({ name: 'classe_predite', type: 'varchar', length: 100, nullable: true })
  classePredite?: string;

  @Column({ name: 'score_confiance', type: 'float', nullable: true })
  scoreConfiance?: number;

  @Column({ name: 'qualite_score', type: 'float', nullable: true })
  qualiteScore?: number;

  @Column({
    name: 'statut',
    type: 'enum',
    enum: ['en_attente', 'en_cours', 'termine', 'erreur'],
    nullable: true,
    default: 'en_attente',
  })
  statut?: 'en_attente' | 'en_cours' | 'termine' | 'erreur';

  @Column({
    name: 'niveau_urgence',
    type: 'enum',
    enum: ['rassurant', 'consulter', 'urgence'],
    nullable: true,
  })
  niveauUrgence?: 'rassurant' | 'consulter' | 'urgence';

  @Column({ name: 'supprime', type: 'tinyint', default: 0 })
  supprime: boolean;

  @Column({ name: 'cree_le', type: 'datetime', nullable: true })
  creeLe?: Date;
}