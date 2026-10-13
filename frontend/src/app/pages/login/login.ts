import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);
  email = '';
  password = '';
  erro = '';

  entrar() {
    this.erro = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/ponto']),
      error: () => this.erro = 'Login inválido',
    });
  }
}