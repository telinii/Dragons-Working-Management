import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Auth } from '../../core/auth';

@Component({
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  selector: 'app-cadastro',
  styleUrl: './cadastro.scss',
  templateUrl: './cadastro.html',
})
export class Cadastro {
  private auth = inject(Auth);
  private router = inject(Router);
  name = '';
  email = '';
  password = '';
  timezone = 'America/Sao_Paulo';
  fusos = ['America/Sao_Paulo', 'Europe/Lisbon', 'Europe/Madrid'];
  erro = '';

  cadastrar() {
    this.erro = '';
    this.auth.register(this.name, this.email, this.password, this.timezone).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (e) => this.erro = e.error?.message ?? 'falha no cadastro',
    });
  }
}