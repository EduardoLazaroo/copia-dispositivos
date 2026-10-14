import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);

  username = 'professor';
  password = '123456';
  loading = false;

  async ionViewWillEnter(): Promise<void> {
    // Evita mostrar login para quem ja esta autenticado.
    if (this.authService.isAuthenticated) {
      await this.router.navigateByUrl('/app/tasks', { replaceUrl: true });
    }
  }

  async onLogin(): Promise<void> {
    await this.authenticate(false);
  }

  async onRegister(): Promise<void> {
    await this.authenticate(true);
  }

  private async authenticate(register: boolean): Promise<void> {
    this.loading = true;

    try {
      // Reaproveita o mesmo fluxo para cadastro e login.
      if (register) {
        await this.authService.register(this.username, this.password);
      } else {
        await this.authService.login(this.username, this.password);
      }
      // Ao autenticar, carrega tarefas do usuario atual.
      await this.taskService.loadTasks();
      await this.router.navigateByUrl('/app/tasks', { replaceUrl: true });
    } catch (error) {
      const toast = await this.toastController.create({
        message: this.getErrorMessage(error, register ? 'Falha ao cadastrar usuario.' : 'Falha ao autenticar.'),
        duration: 2200,
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.loading = false;
    }
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const response = error as { error?: { message?: string } };
      return response.error?.message ?? fallback;
    }

    return error instanceof Error ? error.message : fallback;
  }
}
