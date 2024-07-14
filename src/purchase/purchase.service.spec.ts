import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { Purchase } from './entities/purchase.entity';

describe('PurchaseService', () => {
  let service: PurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseService],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

test('구매 기한 유효성 체크', () => {
  const validPurchase = new Purchase();
  validPurchase.expiresAt = new Date(Date.now() + 10000); // 10초 후 만료

  const invalidPurchase = new Purchase();
  invalidPurchase.expiresAt = new Date(Date.now() - 10000); // 10초 전 만료

  expect(service.isPurchaseValid(validPurchase)).toBe(true);
  expect(service.isPurchaseValid(invalidPurchase)).toBe(false);
});
