import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Jornada } from '../../core/jornada';

@Component({
  imports: [FormsModule],
  selector: 'app-historico',
  styleUrl: './historico.scss',
  templateUrl: './historico.html',
})
export class Historico implements OnInit {
  private jornada = inject(Jornada);
  month = '2026-10';
  eventos: any[] = [];
  msg = '';

  ngOnInit() { this.carregar(); }

  carregar() {
    this.msg = 'carregando...';
    this.jornada.historico(this.month).subscribe({
      next: (res) => { this.eventos = res; this.msg = `${res.length} eventos`; },
      error: () => this.msg = 'erro ao carregar',
    });
  }
}