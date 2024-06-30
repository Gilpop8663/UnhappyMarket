import { Test, TestingModule } from '@nestjs/testing';
import { SagasService } from './sagas.service';

describe('SagasService', () => {
  let service: SagasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SagasService],
    }).compile();

    service = module.get<SagasService>(SagasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
