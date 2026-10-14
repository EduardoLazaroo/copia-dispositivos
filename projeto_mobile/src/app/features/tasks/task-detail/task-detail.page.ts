import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TaskItem, TaskPriority } from '../../../core/models/task.model';
import { NativeService } from '../../../core/services/native.service';
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
  private readonly nativeService = inject(NativeService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);

  task?: TaskItem;

  title = '';
  description = '';
  priority: TaskPriority = 'media';
  dueDate?: string;
  reminderAt?: string;
  photoDataUrl?: string;
  latitude?: number;
  longitude?: number;

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
    this.reminderAt = found.reminderAt;
    this.photoDataUrl = found.photoDataUrl ?? '';
    this.latitude = found.latitude;
    this.longitude = found.longitude;
  }

  async capturePhoto(): Promise<void> {
    // Vincula foto capturada ao registro da tarefa.
    this.photoDataUrl = (await this.nativeService.takePhotoBase64()) ?? undefined;
    if (!this.photoDataUrl) {
      await this.showToast(
        'Nao foi possivel capturar foto neste ambiente.',
        'warning',
      );
    }
  }

  async captureLocation(): Promise<void> {
    // Salva coordenadas para contextualizar a tarefa no mapa/espaco.
    const point = await this.nativeService.getCurrentPosition();
    if (!point) {
      await this.showToast('Nao foi possivel capturar localizacao.', 'warning');
      return;
    }

    this.latitude = point.lat;
    this.longitude = point.lng;
  }

  async scheduleReminder(): Promise<void> {
    if (!this.reminderAt) {
      await this.showToast('Defina data e hora para o lembrete.', 'warning');
      return;
    }

    const ok = await this.nativeService.scheduleReminderAt(
      'Lembrete de tarefa',
      this.title || 'Tarefa sem titulo',
      new Date(this.reminderAt),
    );

    await this.showToast(
      ok ? 'Lembrete agendado.' : 'Falha ao agendar lembrete.',
      ok ? 'success' : 'warning',
    );
  }

  async save(): Promise<void> {
    if (!this.task) {
      return;
    }

    // Persiste alteracoes no backend e retorna para listagem.
    await this.taskService.updateTask({
      ...this.task,
      title: this.title.trim(),
      description: this.description.trim(),
      priority: this.priority,
      dueDate: this.dueDate,
      reminderAt: this.reminderAt,
      photoDataUrl: this.photoDataUrl,
      latitude: this.latitude,
      longitude: this.longitude,
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
