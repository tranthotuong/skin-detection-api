import { Test, TestingModule } from '@nestjs/testing';
import { ScanHistoryController } from './scan-history.controller';

describe('ScanHistoryController', () => {
  let controller: ScanHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScanHistoryController],
    }).compile();

    controller = module.get<ScanHistoryController>(ScanHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
