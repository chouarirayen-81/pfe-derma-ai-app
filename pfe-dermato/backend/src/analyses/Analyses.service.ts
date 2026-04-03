// backend/src/analyses/analyses.service.ts
import {
  Injectable, NotFoundException,
  BadRequestException, HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository }       from 'typeorm';
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

  // ── 1. Créer une analyse (upload image) ──────────────────
  async creerAnalyse(
    utilisateurId: number,
    file: Express.Multer.File,
  ): Promise<Analyse> {

    if (!file) throw new BadRequestException('Aucune image reçue');

    // Hash SHA-256 de l'image pour intégrité
    const imageHash = crypto
      .createHash('sha256')
      .update(file.buffer)
      .digest('hex');

    // Sauvegarder l'image sur le disque
    const uploadDir  = this.config.get('UPLOAD_PATH', './uploads');
    const fileName   = `${Date.now()}-${utilisateurId}.jpg`;
    const filePath   = path.join(uploadDir, fileName);

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(filePath, file.buffer);

    // Créer l'entrée en base avec statut "en_attente"
    const analyse = this.analyseRepo.create({
      utilisateurId,
      imagePath:           filePath,
      imageMiniature:      filePath,
      imageHash,
      metadataSupprimees:  true,
      statut:              'en_attente',
    });
    const saved = await this.analyseRepo.save(analyse);

    // Lancer l'analyse IA en arrière-plan (sans bloquer)
    this.lancerAnalyseIA(saved.id, filePath).catch(console.error);

    return saved;
  }

  // ── 2. Appel au microservice IA (FastAPI binôme) ─────────
  private async lancerAnalyseIA(analyseId: number, imagePath: string) {
    const iaUrl = this.config.get('IA_SERVICE_URL', 'http://localhost:8000');

    // Mettre le statut en "en_cours"
    await this.analyseRepo.update(analyseId, { statut: 'en_cours' });

    try {
      const debut = Date.now();

      // Lire l'image et l'envoyer au microservice IA
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      const response = await firstValueFrom(
        this.httpService.post(`${iaUrl}/predict`, {
          image: base64Image,
        }, { timeout: 30000 }),
      );

      const duree      = Date.now() - debut;
      const resultatIA = response.data;

      // Mettre à jour avec les résultats IA
      // Le microservice retourne :
      // { classe: "acne", score: 87.5, resultats: {...}, conseils: "..." }
      await this.analyseRepo.update(analyseId, {
        statut:           'termine',
        classePredite:    resultatIA.classe,
        scoreConfiance:   resultatIA.score,
        resultatsComplets: resultatIA.resultats,
        modeleVersion:    resultatIA.modele_version ?? 'v1.0',
        dureeInferenceMs: duree,
        niveauUrgence:    this.determinerUrgence(resultatIA.classe, resultatIA.score),
        conseils:         resultatIA.conseils ?? '',
      });

    } catch (error) {
      // En cas d'erreur du microservice IA
      await this.analyseRepo.update(analyseId, {
        statut:       'erreur',
        messageErreur: error?.message ?? 'Analyse impossible — réessayez plus tard',
      });
    }
  }

  // ── 3. Déterminer le niveau d'urgence ────────────────────
  private determinerUrgence(
    classe: string,
    score: number,
  ): 'rassurant' | 'consulter' | 'urgence' {
    const classesUrgentes = ['melanome_suspect', 'plaie_infectee'];
    const classesConsulter = ['psoriasis', 'eczema', 'allergie_contact'];

    if (classesUrgentes.includes(classe))  return 'urgence';
    if (classesConsulter.includes(classe)) return 'consulter';
    return 'rassurant';
  }

  // ── 4. Historique des analyses d'un utilisateur ──────────
  async historique(
    utilisateurId: number,
    page  = 1,
    limit = 20,
    tri   = 'date', // 'date' | 'gravite'
  ) {
    const order: any = tri === 'gravite'
      ? { niveauUrgence: 'DESC' }
      : { creeLe: 'DESC' };

    const [data, total] = await this.analyseRepo.findAndCount({
      where:  { utilisateurId, supprime: false },
      order,
      skip:   (page - 1) * limit,
      take:   limit,
      select: [
        'id', 'imageMiniature', 'classePredite',
        'scoreConfiance', 'niveauUrgence', 'statut', 'creeLe',
      ],
    });

    return { data, total, page, limit };
  }

  // ── 5. Détail d'une analyse ───────────────────────────────
  async detail(id: number, utilisateurId: number): Promise<Analyse> {
    const analyse = await this.analyseRepo.findOne({
      where: { id, utilisateurId, supprime: false },
    });
    if (!analyse) throw new NotFoundException(`Analyse #${id} introuvable`);
    return analyse;
  }

  // ── 6. Supprimer une analyse (suppression douce) ─────────
  async supprimer(id: number, utilisateurId: number) {
    const analyse = await this.detail(id, utilisateurId);
    await this.analyseRepo.update(analyse.id, { supprime: true });
    return { message: `Analyse #${id} supprimée` };
  }

  // ── 7. Résultat d'une analyse (polling depuis le mobile) ──
  // Le mobile appelle cette route toutes les 2s jusqu'à statut = "termine"
  async statut(id: number, utilisateurId: number) {
    const analyse = await this.analyseRepo.findOne({
      where:  { id, utilisateurId },
      select: [
        'id', 'statut', 'classePredite', 'scoreConfiance',
        'niveauUrgence', 'conseils', 'messageErreur', 'dureeInferenceMs',
      ],
    });
    if (!analyse) throw new NotFoundException(`Analyse #${id} introuvable`);
    return analyse;
  }
}