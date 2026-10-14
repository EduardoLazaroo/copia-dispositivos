import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TaskItem, TaskPriority } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
  standalone: false,
})
export class TaskDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);

  task?: TaskItem;

  title = '';
  description = '';
  priority: TaskPriority = 'media';
  dueDate?: string;

  ionViewWillEnter(): void {
    // Recupera id da rota para carregar a tarefa correspondente.
    const id = this.route.snapshot.paramMap.get('id');

    if (id === null) {
      this.router.navigateByUrl('/app/tasks');
      return;
    }

    const found = this.taskService.snapshot.find((task) => task.id === id);

    if (!found) {
      this.router.navigateByUrl('/app/tasks');
      return;
    }

    this.task = found;
    this.title = found.title;
    this.description = found.description;
    this.priority = found.priority;
    this.dueDate = found.dueDate;
  }

  async save(): Promise<void> {
    if (!this.task) {
      return;
    }

    // Persiste alteracoes na tarefa e retorna para listagem.
    await this.taskService.updateTask({
      ...this.task,
      title: this.title.trim(),
      description: this.description.trim(),
      priority: this.priority,
      dueDate: this.dueDate,
      updatedAt: new Date().toISOString(),
    });

    await this.showToast('Tarefa atualizada com sucesso.', 'success');
    await this.router.navigateByUrl('/app/tasks');
  }

  private async showToast(
    message: string,
    color: 'success' | 'warning',
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1800,
      color,
    });
    await toast.present();
  }
}
