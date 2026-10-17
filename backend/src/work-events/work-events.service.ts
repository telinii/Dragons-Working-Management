import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkEvent } from './work-event.entity';
import { CreateWorkEventDto } from './create-work-event.dto';
import { UsersService } from '../users/users.service';
import { calcularResumo } from './work-calc';

@Injectable()
export class WorkEventsService {
  constructor(
    @InjectRepository(WorkEvent) private repo: Repository<WorkEvent>,
    private users: UsersService
  ) {}

  private async lastEvent(userId: string) {
    return this.repo.findOne({
      where: { userId },
      order: { timestampUtc: 'DESC' },
    });
  }
  async create(userId: string, dto: CreateWorkEventDto) {
    const last = await this.lastEvent(userId);
    const lastType = last?.type;

    if (
      dto.type === 'CLOCK_IN' &&
      (lastType === 'CLOCK_IN' ||
        lastType === 'BREAK_START' ||
        lastType === 'BREAK_END')
    )
      throw new BadRequestException('jornada já aberta');
    if (dto.type === 'CLOCK_OUT' && (!last || lastType === 'CLOCK_OUT'))
      throw new BadRequestException('sem jornada aberta');
    if (
      dto.type === 'BREAK_START' &&
      lastType !== 'CLOCK_IN' &&
      lastType !== 'BREAK_END'
    )
      throw new BadRequestException('pausa só com jornada aberta');
    if (dto.type === 'BREAK_END' && lastType !== 'BREAK_START')
      throw new BadRequestException('sem pausa aberta');

    const ev = this.repo.create({
      userId,
      type: dto.type,
      timestampUtc: dto.timestampUtc ? new Date(dto.timestampUtc) : new Date(),
      timezone: dto.timezone ?? 'America/Sao_Paulo',
      note: dto.note ?? null,
    });
    return this.repo.save(ev);
  }

  async listSummary(userId: string, month: string) {
  const eventos = await this.listByMonth(userId, month);
  const user = await this.users.findById(userId);
  return calcularResumo(eventos, user?.timezone ?? 'America/Sao_Paulo');
}

  

  listByMonth(userId: string, month: string) {
    // month=2026-10
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setUTCMonth(end.getUTCMonth() + 1);
    return this.repo
      .createQueryBuilder('e')
      .where('e.userId = :userId', { userId })
      .andWhere('e.timestampUtc >= :start AND e.timestampUtc < :end', {
        start,
        end,
      })
      .orderBy('e.timestampUtc', 'ASC')
      .getMany();
  }
}
