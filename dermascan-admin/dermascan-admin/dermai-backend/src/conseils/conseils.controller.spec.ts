import { Test, TestingModule } from '@nestjs/testing';
import { ConseilsController } from './conseils.controller';
import { ConseilsService } from './conseils.service';

describe('ConseilsController', () => {
  let controller: ConseilsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConseilsController],
      providers: [ConseilsService],
    }).compile();

    controller = module.get<ConseilsController>(ConseilsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
