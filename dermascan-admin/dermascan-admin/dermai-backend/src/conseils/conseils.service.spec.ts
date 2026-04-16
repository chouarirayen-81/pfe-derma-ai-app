import { Test, TestingModule } from '@nestjs/testing';
import { ConseilsService } from './conseils.service';

describe('ConseilsService', () => {
  let service: ConseilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConseilsService],
    }).compile();

    service = module.get<ConseilsService>(ConseilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
