import { Test, TestingModule } from '@nestjs/testing';
import { SmallTalksService } from './small-talks.service';

describe('SmallTalksService', () => {
  let service: SmallTalksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmallTalksService],
    }).compile();

    service = module.get<SmallTalksService>(SmallTalksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
