import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from './auth';

export type EventType = 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END';

@Injectable({ providedIn: 'root' })
export class Jornada {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private api = 'http://localhost:3000';

  private headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` }) };
  }

  bater(type: EventType, timezone = 'America/Sao_Paulo') {
    return this.http.post(`${this.api}/work-events`, { type, timezone }, this.headers());
  }

  historico(month: string) {
    return this.http.get<any[]>(`${this.api}/work-events/me?month=${month}`, this.headers());
  }
}