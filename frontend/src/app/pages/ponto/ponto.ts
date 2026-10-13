import { Component, inject } from '@angular/core';
import { Jornada, EventType } from '../../core/jornada';

@Component({
  imports: [],
  selector: 'app-ponto',
  styleUrl: './ponto.scss',
  templateUrl: './ponto.html',
})
export class Ponto {
  private jornada = inject(Jornada);
  msg = '';

  bater(type: EventType) {
    this.msg = 'enviando...';
    this.jornada.bater(type).subscribe({
      next: (res: any) => this.msg = `OK: ${res.type} às ${res.timestampUtc}`,
      error: (e) => this.msg = `Erro: ${e.error?.message ?? 'falha'}`,
    });
  }
}