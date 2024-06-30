import { Test, TestingModule } from '@nestjs/testing';
import { SagasResolver } from './sagas.resolver';

describe('SagasResolver', () => {
  let resolver: SagasResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SagasResolver],
    }).compile();

    resolver = module.get<SagasResolver>(SagasResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
