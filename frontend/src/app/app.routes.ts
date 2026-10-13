import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Ponto } from './pages/ponto/ponto';
import { Historico } from './pages/historico/historico';
import { authGuard } from './core/auth-guard';
import { Cadastro } from './pages/cadastro/cadastro';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  { path: 'ponto', component: Ponto, canActivate: [authGuard] },
  { path: 'historico', component: Historico, canActivate: [authGuard] },
  { path: '', redirectTo: 'ponto', pathMatch: 'full' },
];