import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WorkEventsService } from './work-events.service';
import { CreateWorkEventDto } from './create-work-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('work-events')
export class WorkEventsController {
  constructor(private service: WorkEventsService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateWorkEventDto) {
    return this.service.create(req.user.sub, dto);
  }
  @Get('me')
  list(@Req() req: any, @Query('month') month: string) {
    return this.service.listByMonth(req.user.sub, month);
  }
}
