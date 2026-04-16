import { Injectable } from '@nestjs/common';

@Injectable()
export class ConseilsService {
  findAll() {
    return [
      {
        id: 1,
        title: 'Hydratation',
        content: 'Utiliser une crème hydratante matin et soir.',
        category: 'Peau sèche',
        createdAt: '2026-04-12T10:00:00.000Z',
      },
      {
        id: 2,
        title: 'Protection solaire',
        content: 'Appliquer un écran solaire SPF 50 avant exposition.',
        category: 'Prévention',
        createdAt: '2026-04-13T12:20:00.000Z',
      },
      {
        id: 3,
        title: 'Consultation médicale',
        content: 'Consulter un dermatologue si la lésion change rapidement.',
        category: 'Alerte',
        createdAt: '2026-04-14T15:45:00.000Z',
      },
    ];
  }
}
