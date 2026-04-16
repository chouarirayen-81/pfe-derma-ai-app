import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll() {
    return [
      {
        id: 1,
        full_name: 'Ahmed Ben Ali',
        email: 'ahmed@email.com',
        phone: '12345678',
        isActive: true,
        createdAt: '2026-04-12T10:00:00.000Z',
      },
      {
        id: 2,
        full_name: 'Ines Trabelsi',
        email: 'ines@email.com',
        phone: '22334455',
        isActive: false,
        createdAt: '2026-04-13T11:30:00.000Z',
      },
      {
        id: 3,
        full_name: 'Sarra Khalfallah',
        email: 'sarra@email.com',
        phone: '99887766',
        isActive: true,
        createdAt: '2026-04-14T09:15:00.000Z',
      },
    ];
  }
}