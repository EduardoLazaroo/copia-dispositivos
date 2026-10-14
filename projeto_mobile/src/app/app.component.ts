import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { PreferencesService } from './core/services/preferences.service';
import { TaskService } from './core/services/task.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly preferencesService = inject(PreferencesService);
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);

  isAuthenticated = false;
  displayName = 'estudante';

  constructor() {
    // Inicializa sessao, preferencias e estado global ao abrir o app.
    this.bootstrapApplication();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.taskService.clear();
    this.isAuthenticated = false;
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  private async bootstrapApplication(): Promise<void> {
    // Recupera sessao persistida para manter login entre reinicios.
    await this.authService.restoreSession();
    const preferences = await this.preferencesService.load();
    this.displayName = preferences.displayName;
    document.body.classList.toggle('dark', preferences.darkMode);

    this.authService.session$.subscribe((session) => {
      this.isAuthenticated = Boolean(session?.token);
      this.displayName = session?.username ?? preferences.displayName;
    });

    // Carrega tarefas apenas quando ha usuario autenticado.
    if (this.authService.isAuthenticated) {
      await this.taskService.loadTasks();
    }
  }
}
