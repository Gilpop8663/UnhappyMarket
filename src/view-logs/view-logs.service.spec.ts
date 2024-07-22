import { Test, TestingModule } from '@nestjs/testing';
import { ViewLogsService } from './view-logs.service';

describe('ViewLogsService', () => {
  let service: ViewLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViewLogsService],
    }).compile();

    service = module.get<ViewLogsService>(ViewLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
