import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Jornada, EventType } from '../../core/jornada';

@Component({
  imports: [MatCardModule, MatButtonModule],
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