import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkEvent } from './work-event.entity';
import { WorkEventsService } from './work-events.service';
import { WorkEventsController } from './work-events.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkEvent]), UsersModule],
  providers: [WorkEventsService],
  controllers: [WorkEventsController]
})
export class WorkEventsModule {}
