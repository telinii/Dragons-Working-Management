import { Test, TestingModule } from '@nestjs/testing';
import { WorkEventsService } from './work-events.service';

describe('WorkEventsService', () => {
  let service: WorkEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkEventsService],
    }).compile();

    service = module.get<WorkEventsService>(WorkEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
