import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsService {
  getStats() {
    return {
      totalUsers: 120,
      totalAnalyses: 340,
      totalConseils: 25,
    };
  }
}
