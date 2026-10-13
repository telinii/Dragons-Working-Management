import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private api = 'http://localhost:3000';

  login(email: string, password: string) {
    return this.http.post<{ access_token: string }>(`${this.api}/auth/login`, { email, password })
      .pipe(tap(res => localStorage.setItem('token', res.access_token)));
  }
  getToken() { return localStorage.getItem('token'); }
  isLoggedIn() { return !!this.getToken(); }
  logout() { localStorage.removeItem('token'); }
}