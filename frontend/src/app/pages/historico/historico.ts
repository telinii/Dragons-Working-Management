import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Jornada } from '../../core/jornada';

@Component({
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatTableModule],
  selector: 'app-historico',
  styleUrl: './historico.scss',
  templateUrl: './historico.html',
})
export class Historico implements OnInit {
  private jornada = inject(Jornada);
  month = '2026-10';
  eventos: any[] = [];
  msg = '';
  colunas = ['type', 'timestampUtc', 'horaLocal', 'timezone'];

  ngOnInit() { this.carregar(); }

  carregar() {
    this.msg = 'carregando...';
    this.jornada.historico(this.month).subscribe({
      next: (res) => { this.eventos = res; this.msg = `${res.length} eventos`; },
      error: () => this.msg = 'erro ao carregar',
    });
  }
  formatarLocal(utc: string, tz: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: tz, day: '2-digit', month: '2-digit',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(utc));
  } catch { return utc; }
}
}