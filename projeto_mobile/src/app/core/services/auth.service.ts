import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserSession } from '../models/user-session.model';
import { StorageService } from './storage.service';

const SESSION_KEY = 'pm_user_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageService = inject(StorageService);
  private readonly http = inject(HttpClient);

  private readonly sessionSubject = new BehaviorSubject<UserSession | null>(null);
  readonly session$ = this.sessionSubject.asObservable();

  get currentSession(): UserSession | null {
    return this.sessionSubject.value;
  }

  get isAuthenticated(): boolean {
    return Boolean(this.currentSession?.token);
  }

  async restoreSession(): Promise<void> {
    // Reidrata a sessao salva no dispositivo.
    const session = await this.storageService.getJson<UserSession>(SESSION_KEY);
    this.sessionSubject.next(session);
  }

  async login(username: string, password: string): Promise<UserSession> {
    // Validacao rapida no cliente para evitar chamada invalida.
    if (!username?.trim() || !password?.trim()) {
      throw new Error('Informe usuario e senha para continuar.');
    }

    const session = await firstValueFrom(
      this.http.post<UserSession>(`${environment.apiUrl}/auth/login`, { username, password }),
    );

    await this.saveSession(session);
    return session;
  }

  async register(username: string, password: string): Promise<UserSession> {
    // Mesmo contrato de entrada usado no login.
    if (!username?.trim() || !password?.trim()) {
      throw new Error('Informe usuario e senha para continuar.');
    }

    const session = await firstValueFrom(
      this.http.post<UserSession>(`${environment.apiUrl}/auth/register`, { username, password }),
    );

    await this.saveSession(session);
    return session;
  }

  private async saveSession(session: UserSession): Promise<void> {
    // Persiste e publica sessao para toda a aplicacao.
    await this.storageService.setJson(SESSION_KEY, session);
    this.sessionSubject.next(session);
  }

  async logout(): Promise<void> {
    await this.storageService.remove(SESSION_KEY);
    this.sessionSubject.next(null);
  }
}
