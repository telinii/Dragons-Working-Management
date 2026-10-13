import { Test, TestingModule } from '@nestjs/testing';
import { WorkEventsController } from './work-events.controller';

describe('WorkEventsController', () => {
  let controller: WorkEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkEventsController],
    }).compile();

    controller = module.get<WorkEventsController>(WorkEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
