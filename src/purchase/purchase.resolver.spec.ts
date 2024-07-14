import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseResolver } from './purchase.resolver';

describe('PurchaseResolver', () => {
  let resolver: PurchaseResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseResolver],
    }).compile();

    resolver = module.get<PurchaseResolver>(PurchaseResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
