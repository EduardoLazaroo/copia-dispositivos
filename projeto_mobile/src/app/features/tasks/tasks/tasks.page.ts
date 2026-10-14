import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { TaskItem, TaskPriority } from '../../../core/models/task.model';
import { ApiService } from '../../../core/services/api.service';
import { PreferencesService } from '../../../core/services/preferences.service';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false,
})
export class TasksPage {
  readonly taskService = inject(TaskService);
  private readonly apiService = inject(ApiService);
  private readonly preferencesService = inject(PreferencesService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);
  private readonly alertController = inject(AlertController);

  title = '';
  description = '';
  priority: TaskPriority = 'media';
  dueDate?: string;
  showCompleted = true;

  async ionViewWillEnter(): Promise<void> {
    // Preferencia controla filtro visual de tarefas concluidas.
    const preferences = await this.preferencesService.load();
    this.showCompleted = preferences.showCompleted;
  }

  async onAddTask(): Promise<void> {
    if (!this.title.trim()) {
      await this.showToast('Informe um titulo para a tarefa.', 'warning');
      return;
    }

    // Cria tarefa no backend e atualiza estado da lista.
    await this.taskService.addTask(this.title, this.description, this.priority, this.dueDate);

    this.title = '';
    this.description = '';
    this.priority = 'media';
    this.dueDate = undefined;
  }

  async onToggleTask(task: TaskItem): Promise<void> {
    await this.taskService.toggleDone(task.id);
  }

  async onRemoveTask(task: TaskItem): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Remover tarefa',
      message: `Deseja remover a tarefa "${task.title}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Remover',
          role: 'destructive',
          handler: () => {
            this.taskService.removeTask(task.id);
          },
        },
      ],
    });

    await alert.present();
  }

  importExternalTasks(): void {
    // Importa dados de API publica para praticar integracao REST.
    this.apiService.getExternalTodos().subscribe({
      next: async (todos) => {
        const imported: TaskItem[] = todos.map((todo) => {
          const now = new Date().toISOString();
          return {
            id: `api-${todo.id}`,
            title: todo.title,
            description: 'Importada de API externa para aula de integracao.',
            done: todo.completed,
            priority: 'media',
            createdAt: now,
            updatedAt: now,
          };
        });

        await this.taskService.replaceAll(imported);
        await this.showToast('Tarefas externas importadas com sucesso.', 'success');
      },
      error: async () => {
        await this.showToast('Falha ao importar tarefas externas.', 'danger');
      },
    });
  }

  trackByTask(_: number, task: TaskItem): string {
    return task.id;
  }

  goToDetails(task: TaskItem): void {
    this.router.navigate(['/app/tasks', task.id]);
  }

  get visibleTasks(): TaskItem[] {
    if (this.showCompleted) {
      return this.taskService.snapshot;
    }

    return this.taskService.snapshot.filter((task) => !task.done);
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1800,
      color,
    });

    await toast.present();
  }
}
