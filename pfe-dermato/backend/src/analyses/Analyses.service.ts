// backend/src/analyses/Analyses.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import { Analyse } from './analyse.entity';
import { Pathologie } from '../Pathologie/pathologie.entity';

@Injectable()
export class AnalysesService {
  constructor(
    @InjectRepository(Analyse)
    private analyseRepo: Repository<Analyse>,

    @InjectRepository(Pathologie)
    private pathologieRepo: Repository<Pathologie>,

    private httpService: HttpService,
    private config: ConfigService,
  ) {}

  private normalizePredictionCode(value?: string | null): string | null {
    if (!value) return null;
    const v = String(value).trim().toLowerCase();
    return v.length ? v : null;
  }

  private async resolvePathologieIdFromClasse(
    classePredite?: string | null,
  ): Promise<number | null> {
    const code = this.normalizePredictionCode(classePredite);
    if (!code) return null;

    const pathologie = await this.pathologieRepo.findOne({
      where: { code, actif: true },
      select: ['id', 'code', 'nom'],
    });

    return pathologie?.id ?? null;
  }

  private formatAnalyse(analyse: Analyse) {
    return {
      id: analyse.id,

      utilisateurId: analyse.utilisateurId,
      utilisateur_id: analyse.utilisateurId,

      imagePath: analyse.imagePath,
      image_path: analyse.imagePath,

      imageMiniature: analyse.imageMiniature,
      image_miniature: analyse.imageMiniature,

      imageHash: analyse.imageHash,
      image_hash: analyse.imageHash,

      qualiteScore: analyse.qualiteScore,
      qualite_score: analyse.qualiteScore,

      qualiteOk: analyse.qualiteOk,
      qualite_ok: analyse.qualiteOk,

      statut: analyse.statut,

      classePredite: analyse.classePredite,
      classe_predite: analyse.classePredite,

      scoreConfiance: analyse.scoreConfiance,
      score_confiance: analyse.scoreConfiance,

      resultatsComplets: analyse.resultatsComplets,
      resultats_complets: analyse.resultatsComplets,

      modeleVersion: analyse.modeleVersion,
      modele_version: analyse.modeleVersion,

      dureeInferenceMs: analyse.dureeInferenceMs,
      duree_inference_ms: analyse.dureeInferenceMs,

      niveauUrgence: analyse.niveauUrgence,
      niveau_urgence: analyse.niveauUrgence,

      conseils: analyse.conseils,

      pathologieId: analyse.pathologieId ?? null,
      pathologie_id: analyse.pathologieId ?? null,

      supprime: analyse.supprime,

      creeLe: analyse.creeLe,
      cree_le: analyse.creeLe,

      misAJourLe: analyse.misAJourLe,
      mis_a_jour_le: analyse.misAJourLe,

      metadataSupprimees: analyse.metadataSupprimees,
      metadata_supprimees: analyse.metadataSupprimees,

      messageErreur: analyse.messageErreur,
      message_erreur: analyse.messageErreur,
    };
  }

  // ── 1. Upload image → DB ─────────────────────────────────────────────────
  async creerAnalyse(
    utilisateurId: number,
    file: Express.Multer.File,
    source?: string,
  ): Promise<{
    analyseId: number;
    imagePath: string;
    imageUrl: string;
    statut: string;
  }> {
    if (!file) {
      throw new BadRequestException('Aucune image reçue');
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException("Le fichier image n'a pas de contenu");
    }

    const uploadDir = this.config.get<string>('UPLOAD_PATH') || './uploads';

    const ext =
      file.mimetype === 'image/png'
        ? 'png'
        : file.mimetype === 'image/webp'
          ? 'webp'
          : 'jpg';

    const fileName = `${Date.now()}-${utilisateurId}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);

    const imageHash = crypto
      .createHash('sha256')
      .update(file.buffer)
      .digest('hex');

    const analyse = new Analyse();

    analyse.utilisateurId = utilisateurId;
    analyse.imagePath = filePath;
    analyse.imageMiniature = `/uploads/${fileName}`;
    analyse.imageHash = imageHash;
    analyse.qualiteScore = null as any;
    analyse.qualiteOk = false;
    analyse.metadataSupprimees = true;
    analyse.statut = 'en_attente';
    analyse.classePredite = null as any;
    analyse.scoreConfiance = null as any;
    analyse.resultatsComplets = null as any;
    analyse.modeleVersion = null as any;
    analyse.dureeInferenceMs = null as any;
    analyse.messageErreur = null as any;
    analyse.niveauUrgence = null as any;
    analyse.conseils = null as any;
    analyse.pathologieId = null as any;
    analyse.supprime = false;

    const saved = await this.analyseRepo.save(analyse);

    return {
      analyseId: saved.id,
      imagePath: saved.imagePath,
      imageUrl: saved.imageMiniature,
      statut: saved.statut,
    };
  }

  // ── 2. Vérifier la qualité ────────────────────────────────────────────────
  async verifierQualite(analyseId: number, utilisateurId: number) {
    const analyse = await this.analyseRepo.findOne({
      where: { id: analyseId, utilisateurId },
    });

    if (!analyse) {
      throw new NotFoundException(`Analyse #${analyseId} introuvable`);
    }

    const iaUrl =
      this.config.get<string>('IA_SERVICE_URL') || 'http://127.0.0.1:8000';

    try {
      const imageBuffer = fs.readFileSync(analyse.imagePath);
      const base64Image = imageBuffer.toString('base64');

      const response = await firstValueFrom(
        this.httpService.post(
          `${iaUrl}/qualite`,
          { image: base64Image },
          { timeout: 15000 },
        ),
      );

      const qualite = response.data;

      await this.analyseRepo.update(analyseId, {
        qualiteScore: qualite.score_global ?? 0,
        qualiteOk: qualite.qualite_ok ?? false,
      });

      return {
        analyseId,
        nettete: qualite.nettete ?? 0,
        luminosite: qualite.luminosite ?? 0,
        miseAuPoint: qualite.mise_au_point ?? 0,
        scoreGlobal: qualite.score_global ?? 0,
        qualiteOk: qualite.qualite_ok ?? false,
      };
    } catch (err: any) {
      console.log('Erreur qualité IA:', err?.response?.data || err?.message);

      throw new BadRequestException(
        err?.response?.data?.detail ||
          'Impossible de vérifier la qualité de l’image',
      );
    }
  }

  // ── 3. Lancer l'analyse IA complète ───────────────────────────────────────
  async lancerAnalyse(analyseId: number, utilisateurId: number): Promise<any> {
    const analyse = await this.analyseRepo.findOne({
      where: { id: analyseId, utilisateurId },
    });

    if (!analyse) {
      throw new NotFoundException(`Analyse #${analyseId} introuvable`);
    }

    await this.analyseRepo.update(analyseId, { statut: 'en_cours' });

    const iaUrl = this.config.get<string>('IA_SERVICE_URL', 'http://localhost:8000');

    try {
      const debut = Date.now();
      const imageBuffer = fs.readFileSync(analyse.imagePath);
      const base64Image = imageBuffer.toString('base64');

      const response = await firstValueFrom(
        this.httpService.post(
          `${iaUrl}/predict`,
          { image: base64Image },
          { timeout: 30000 },
        ),
      );

      const duree = Date.now() - debut;
      const resultatIA = response.data;

      const classePredite = this.normalizePredictionCode(resultatIA.classe);
      const pathologieId = await this.resolvePathologieIdFromClasse(classePredite);

      await this.analyseRepo.update(analyseId, {
  statut: 'termine',
  classePredite: classePredite as any,
  scoreConfiance: resultatIA.score ?? 0,
  resultatsComplets: resultatIA.resultats ?? {},
  modeleVersion: resultatIA.modele_version ?? 'efficientnet_b3_v1',
  dureeInferenceMs: duree,
  niveauUrgence:
    resultatIA.niveau_urgence ??
    this.determinerUrgence(classePredite || '', Number(resultatIA.score ?? 0)),
  conseils: resultatIA.conseils ?? '',
  pathologieId: pathologieId as any,
  messageErreur: null as any,
});

      const saved = await this.analyseRepo.findOne({
        where: { id: analyseId, utilisateurId },
      });

      if (!saved) {
        throw new NotFoundException(`Analyse #${analyseId} introuvable après mise à jour`);
      }

      return this.formatAnalyse(saved);
    } catch (error: any) {
      await this.analyseRepo.update(analyseId, {
        statut: 'erreur',
        messageErreur: error?.message ?? 'Analyse impossible',
      });

      throw new Error('Analyse IA échouée: ' + (error?.message ?? 'Erreur inconnue'));
    }
  }

  // ── 4. Statut polling ─────────────────────────────────────────────────────
  async statut(id: number, utilisateurId: number) {
    const analyse = await this.analyseRepo.findOne({
      where: { id, utilisateurId },
      select: [
        'id',
        'statut',
        'classePredite',
        'scoreConfiance',
        'niveauUrgence',
        'conseils',
        'messageErreur',
        'dureeInferenceMs',
        'resultatsComplets',
        'imageMiniature',
        'qualiteScore',
        'qualiteOk',
        'pathologieId',
      ],
    });

    if (!analyse) {
      throw new NotFoundException(`Analyse #${id} introuvable`);
    }

    return this.formatAnalyse(analyse);
  }

  // ── 5. Détail complet ──────────────────────────────────────────────────────
  async detail(id: number, utilisateurId: number): Promise<any> {
    const analyse = await this.analyseRepo.findOne({
      where: { id, utilisateurId, supprime: false },
    });

    if (!analyse) {
      throw new NotFoundException(`Analyse #${id} introuvable`);
    }

    return this.formatAnalyse(analyse);
  }

  // ── 6. Historique ──────────────────────────────────────────────────────────
  async historique(utilisateurId: number, page = 1, limit = 20, tri = 'date') {
    const order: any =
      tri === 'gravite' ? { niveauUrgence: 'DESC' } : { creeLe: 'DESC' };

    const [data, total] = await this.analyseRepo.findAndCount({
      where: { utilisateurId, supprime: false },
      order,
      skip: (page - 1) * limit,
      take: limit,
      select: [
        'id',
        'imageMiniature',
        'classePredite',
        'scoreConfiance',
        'niveauUrgence',
        'statut',
        'creeLe',
        'pathologieId',
      ],
    });

    return {
      data: data.map((item) => this.formatAnalyse(item)),
      total,
      page,
      limit,
    };
  }

  // ── 7. Supprimer ───────────────────────────────────────────────────────────
  async supprimer(id: number, utilisateurId: number) {
    const analyse = await this.detail(id, utilisateurId);
    await this.analyseRepo.update(analyse.id, { supprime: true });
    return { message: `Analyse #${id} supprimée` };
  }

  // ── 8. Dashboard ───────────────────────────────────────────────────────────
  async getDashboardData(userId: number) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const totalAnalyses = await this.analyseRepo.count({
      where: { utilisateurId: userId, supprime: false },
    });

    const analysesCeMois = await this.analyseRepo.count({
      where: {
        utilisateurId: userId,
        supprime: false,
        creeLe: Between(startOfMonth, endOfMonth),
      },
    });

    const recent = await this.analyseRepo.find({
      where: { utilisateurId: userId, supprime: false },
      order: { creeLe: 'DESC' },
      take: 5,
      select: [
        'id',
        'creeLe',
        'classePredite',
        'scoreConfiance',
        'imageMiniature',
        'niveauUrgence',
        'statut',
        'pathologieId',
      ],
    });

    return {
      totalAnalyses,
      analysesCeMois,
      scoreSante: Math.min(100, Math.round(totalAnalyses > 0 ? 94 : 0)),
      recentAnalyses: recent.map((item) => ({
        id: item.id,
        date: item.creeLe,
        title: item.classePredite || 'Analyse dermatologique',
        confidence: item.scoreConfiance || 0,
        tag:
          item.niveauUrgence === 'urgence'
            ? 'À vérifier'
            : item.niveauUrgence === 'consulter'
              ? 'Suivi conseillé'
              : 'Faible risque',
        imageUrl: item.imageMiniature || '',
        pathologieId: item.pathologieId ?? null,
      })),
    };
  }

  private determinerUrgence(
    classe: string,
    score: number,
  ): 'rassurant' | 'consulter' | 'urgence' {
    const urgents = ['melanome_suspect', 'plaie_infectee', 'carcinome'];
    const consulter = ['psoriasis', 'eczema', 'dermatite', 'allergie'];

    if (urgents.some((u) => classe?.toLowerCase().includes(u))) return 'urgence';
    if (consulter.some((c) => classe?.toLowerCase().includes(c))) return 'consulter';

    return 'rassurant';
  }

  private computeScoreSante(analyses: Analyse[]): number {
    const done = analyses.filter((a) => a.statut === 'termine');

    if (done.length === 0) return 100;

    const avgPenalty =
      done.reduce((sum, a) => {
        const urgencePenalty =
          a.niveauUrgence === 'urgence'
            ? 40
            : a.niveauUrgence === 'consulter'
              ? 20
              : 0;

        const confidencePenalty =
          Math.max(0, 100 - Number(a.scoreConfiance || 0)) * 0.15;

        return sum + urgencePenalty + confidencePenalty;
      }, 0) / done.length;

    return Math.max(0, Math.min(100, Math.round(100 - avgPenalty)));
  }
}