import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseService } from './purchase.service';
import { Purchase } from './entities/purchase.entity';
import { User } from 'src/users/entities/user.entity';
import { Episode } from 'src/sagas/episodes/entities/episode.entity';

const mockUserRepository = {};
const mockEpisodeRepository = {};
const mockSmallTalkRepository = {};
const mockPurchaseRepository = {};
describe('PurchaseService', () => {
  let service: PurchaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseService,
        { provide: 'UserRepository', useValue: mockUserRepository },
        { provide: 'EpisodeRepository', useValue: mockEpisodeRepository },
        { provide: 'SmallTalkRepository', useValue: mockSmallTalkRepository },
        { provide: 'PurchaseRepository', useValue: mockPurchaseRepository },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('구매 기한 유효성 체크', () => {
    const validPurchase = new Purchase();
    validPurchase.expiresAt = new Date(Date.now() + 10000); // 10초 후 만료

    const invalidPurchase = new Purchase();
    invalidPurchase.expiresAt = new Date(Date.now() - 10000); // 10초 전 만료

    expect(service.isPurchaseValid(validPurchase)).toBe(true);
    expect(service.isPurchaseValid(invalidPurchase)).toBe(false);
  });

  it('유저 정보를 입력했을 때 구매한 에피소드 목록을 반환한다.', async () => {
    const purchase = new Purchase();
    const purchase2 = new Purchase();
    const episode = new Episode();
    const user = new User();
    const user2 = new User();
    purchase.user = user;
    purchase.episode = episode;
    purchase2.user = user2;

    const purchaseList = service.findPurchasedEpisodes(user.id);

    expect(purchaseList.length).toBe(1);
  });

  it('유저 정보를 입력했을 때 구매한 에피소드 목록을 반환한다. 에피소드가 없다면 반환하지 않는다.', async () => {
    const purchase = new Purchase();
    const user = new User();
    purchase.user = user;

    const purchaseList = service.findPurchasedEpisodes(user.id);

    expect(purchaseList.length).toBe(0);
  });
});
