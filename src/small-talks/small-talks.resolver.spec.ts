import { Test, TestingModule } from '@nestjs/testing';
import { SmallTalksResolver } from './small-talks.resolver';

describe('SmallTalksResolver', () => {
  let resolver: SmallTalksResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmallTalksResolver],
    }).compile();

    resolver = module.get<SmallTalksResolver>(SmallTalksResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
