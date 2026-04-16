// backend/src/analyses/Analyses.service.ts
import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { HttpService }      from '@nestjs/axios';
import { ConfigService }    from '@nestjs/config';
import { firstValueFrom }   from 'rxjs';
import * as fs              from 'fs';
import * as path            from 'path';
import * as crypto          from 'crypto';
import { Analyse }          from './analyse.entity';

@Injectable()
export class AnalysesService {
  constructor(
    @InjectRepository(Analyse)
    private analyseRepo: Repository<Analyse>,
    private httpService: HttpService,
    private config: ConfigService,
  ) {}
  


  // ── 1. Upload image → DB (statut en_attente) ─────────────────────────────
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
    file.mimetype === 'image/png' ? 'png' :
    file.mimetype === 'image/webp' ? 'webp' :
    'jpg';

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
analyse.supprime = false;

const saved = await this.analyseRepo.save(analyse);

return {
  analyseId: saved.id,
  imagePath: saved.imagePath,
  imageUrl: saved.imageMiniature,
  statut: saved.statut,
};
}

  // ── 2. Vérifier la qualité de l'image (appelé depuis qualite.tsx) ─────────
  // ✅ Appelle le microservice IA /qualite et met à jour la DB
  async verifierQualite(analyseId: number, utilisateurId: number) {
  const analyse = await this.analyseRepo.findOne({
    where: { id: analyseId, utilisateurId },
  });

  if (!analyse) {
    throw new NotFoundException(`Analyse #${analyseId} introuvable`);
  }

  const iaUrl = this.config.get<string>('IA_SERVICE_URL') || 'http://127.0.0.1:8000';

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
      err?.response?.data?.detail || 'Impossible de vérifier la qualité de l’image',
    );
  }
}

  // ── 3. Lancer l'analyse IA complète ──────────────────────────────────────
  // ✅ Appelé depuis qualite.tsx quand l'utilisateur clique "Lancer l'analyse IA"
  async lancerAnalyse(analyseId: number, utilisateurId: number): Promise<Analyse> {
    const analyse = await this.analyseRepo.findOne({
      where: { id: analyseId, utilisateurId },
    });
    if (!analyse) throw new NotFoundException(`Analyse #${analyseId} introuvable`);

    // Mettre en "en_cours"
    await this.analyseRepo.update(analyseId, { statut: 'en_cours' });

    const iaUrl = this.config.get('IA_SERVICE_URL', 'http://localhost:8000');

    try {
      const debut = Date.now();
      const imageBuffer = fs.readFileSync(analyse.imagePath);
      const base64Image = imageBuffer.toString('base64');

      const response = await firstValueFrom(
        this.httpService.post(`${iaUrl}/predict`, { image: base64Image }, { timeout: 30000 })
      );

      const duree      = Date.now() - debut;
      const resultatIA = response.data;
      // { classe, score, resultats, conseils, niveau_urgence, modele_version }

      // ✅ Enregistre tout en DB
      await this.analyseRepo.update(analyseId, {
        statut:           'termine',
        classePredite:    resultatIA.classe,
        scoreConfiance:   resultatIA.score,
        resultatsComplets: resultatIA.resultats,
        modeleVersion:    resultatIA.modele_version ?? 'efficientnet_b3_v1',
        dureeInferenceMs: duree,
        niveauUrgence:    resultatIA.niveau_urgence ?? this.determinerUrgence(resultatIA.classe, resultatIA.score),
        conseils:         resultatIA.conseils ?? '',
      });

      return this.analyseRepo.findOne({ where: { id: analyseId } }) as Promise<Analyse>;

    } catch (error: any) {
      await this.analyseRepo.update(analyseId, {
        statut:       'erreur',
        messageErreur: error?.message ?? 'Analyse impossible',
      });
      throw new Error('Analyse IA échouée: ' + error?.message);
    }
  }

  // ── 4. Statut polling ─────────────────────────────────────────────────────
  async statut(id: number, utilisateurId: number) {
    const analyse = await this.analyseRepo.findOne({
      where:  { id, utilisateurId },
      select: [
        'id', 'statut', 'classePredite', 'scoreConfiance',
        'niveauUrgence', 'conseils', 'messageErreur',
        'dureeInferenceMs', 'resultatsComplets', 'imageMiniature',
        'qualiteScore', 'qualiteOk',
      ],
    });
    if (!analyse) throw new NotFoundException(`Analyse #${id} introuvable`);
    return analyse;
  }

  // ── 5. Détail complet ─────────────────────────────────────────────────────
  async detail(id: number, utilisateurId: number): Promise<Analyse> {
    const analyse = await this.analyseRepo.findOne({
      where: { id, utilisateurId, supprime: false },
    });
    if (!analyse) throw new NotFoundException(`Analyse #${id} introuvable`);
    return analyse;
  }

  // ── 6. Historique ─────────────────────────────────────────────────────────
  async historique(utilisateurId: number, page = 1, limit = 20, tri = 'date') {
    const order: any = tri === 'gravite' ? { niveauUrgence: 'DESC' } : { creeLe: 'DESC' };
    const [data, total] = await this.analyseRepo.findAndCount({
      where:  { utilisateurId, supprime: false },
      order,
      skip:   (page - 1) * limit,
      take:   limit,
      select: ['id', 'imageMiniature', 'classePredite', 'scoreConfiance', 'niveauUrgence', 'statut', 'creeLe'],
    });
    return { data, total, page, limit };
  }

  // ── 7. Supprimer ──────────────────────────────────────────────────────────
  async supprimer(id: number, utilisateurId: number) {
    const analyse = await this.detail(id, utilisateurId);
    await this.analyseRepo.update(analyse.id, { supprime: true });
    return { message: `Analyse #${id} supprimée` };
  }

  // ── 8. Dashboard ─────────────────────────────────────────────────────────
  async getDashboardData(userId: number) {
    
    const now          = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const totalAnalyses  = await this.analyseRepo.count({ where: { utilisateurId: userId, supprime: false } });
    const analysesCeMois = await this.analyseRepo.count({
      where: { utilisateurId: userId, supprime: false, creeLe: Between(startOfMonth, endOfMonth) },
    });

    const recent = await this.analyseRepo.find({
      where:  { utilisateurId: userId, supprime: false },
      order:  { creeLe: 'DESC' },
      take:   5,
      select: ['id', 'creeLe', 'classePredite', 'scoreConfiance', 'imageMiniature', 'niveauUrgence', 'statut'],
    });

    return {
      totalAnalyses,
      analysesCeMois,
      scoreSante:     Math.min(100, Math.round((totalAnalyses > 0 ? 94 : 0))),
      recentAnalyses: recent.map(item => ({
        id:         item.id,
        date:       item.creeLe,
        title:      item.classePredite || 'Analyse dermatologique',
        confidence: item.scoreConfiance || 0,
        tag:        item.niveauUrgence === 'urgence' ? 'À vérifier'
                  : item.niveauUrgence === 'consulter' ? 'Suivi conseillé' : 'Faible risque',
        imageUrl:   item.imageMiniature || '',
      })),
    };
  }

  private determinerUrgence(classe: string, score: number): 'rassurant' | 'consulter' | 'urgence' {
    const urgents   = ['melanome_suspect', 'plaie_infectee', 'carcinome'];
    const consulter = ['psoriasis', 'eczema', 'dermatite', 'allergie'];
    if (urgents.some(u => classe?.toLowerCase().includes(u)))   return 'urgence';
    if (consulter.some(c => classe?.toLowerCase().includes(c))) return 'consulter';
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

      const confidencePenalty = Math.max(0, 100 - Number(a.scoreConfiance || 0)) * 0.15;

      return sum + urgencePenalty + confidencePenalty;
    }, 0) / done.length;

  return Math.max(0, Math.min(100, Math.round(100 - avgPenalty)));
}
}