import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export type WorkEventType =
  'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END';

@Entity('work_events')
export class WorkEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 20 })
  type: WorkEventType;

  @Column({ name: 'timestamp_utc', type: 'datetimeoffset' })
  timestampUtc: Date;

  @Column({ length: 60, default: 'America/Sao_Paulo' })
  timezone: string;

  @Column({ type: 'varchar', length: 280, nullable: true })
  note: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
