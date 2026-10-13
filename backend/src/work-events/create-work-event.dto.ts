export class CreateWorkEventDto {
  type: 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END';
  timestampUtc?: string;
  timezone?: string;
  note?: string;
}