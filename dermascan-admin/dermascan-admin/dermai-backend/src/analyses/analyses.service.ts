import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalysesService {
  findAll() {
    return [
      {
        id: 1,
        userId: 1,
        imageUrl: '/uploads/analyse-1.jpg',
        predictedClass: 'Eczema',
        confidence: 0.91,
        createdAt: '2026-04-15T10:20:00.000Z',
      },
      {
        id: 2,
        userId: 2,
        imageUrl: '/uploads/analyse-2.jpg',
        predictedClass: 'Psoriasis',
        confidence: 0.87,
        createdAt: '2026-04-15T11:10:00.000Z',
      },
      {
        id: 3,
        userId: 3,
        imageUrl: '/uploads/analyse-3.jpg',
        predictedClass: 'Acne',
        confidence: 0.95,
        createdAt: '2026-04-15T14:30:00.000Z',
      },
    ];
  }
}