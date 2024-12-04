import { Test, TestingModule } from '@nestjs/testing';
import { ScanHistoryService } from './scan-history.service';

describe('ScanHistoryService', () => {
  let service: ScanHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScanHistoryService],
    }).compile();

    service = module.get<ScanHistoryService>(ScanHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
