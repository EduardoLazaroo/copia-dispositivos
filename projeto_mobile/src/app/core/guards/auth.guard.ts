import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);


  canActivate(): boolean {
    // Libera apenas quando a sessao ja possui token valido.
    if (this.authService.isAuthenticated) {
      return true;
    }

    // Sem sessao, redireciona para autenticacao.
    this.router.navigate(['/login']);
    return false;
  }
}
