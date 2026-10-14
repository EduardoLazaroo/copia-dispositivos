import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskItem, TaskPriority } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);

  private readonly tasksSubject = new BehaviorSubject<TaskItem[]>([]);
  readonly tasks$ = this.tasksSubject.asObservable();

  get snapshot(): TaskItem[] {
    return this.tasksSubject.value;
  }

  clear(): void {
    this.tasksSubject.next([]);
  }

  async loadTasks(): Promise<void> {
    // Fonte da verdade vem da API autenticada.
    const tasks = await firstValueFrom(this.http.get<TaskItem[]>(`${environment.apiUrl}/tasks`));
    this.tasksSubject.next(tasks);
  }

  async addTask(title: string, description: string, priority: TaskPriority, dueDate?: string): Promise<void> {
    // Atualizacao otimista local apos sucesso no backend.
    const task = await firstValueFrom(this.http.post<TaskItem>(`${environment.apiUrl}/tasks`, {
      title: title.trim(),
      description: description.trim(),
      done: false,
      priority,
      dueDate,
    }));
    this.tasksSubject.next([task, ...this.snapshot]);
  }

  async toggleDone(id: string): Promise<void> {
    const currentTask = this.snapshot.find((task) => task.id === id);
    if (!currentTask) return;

    // Reaproveita o objeto atual, alterando apenas o status.
    const updatedTask = await firstValueFrom(this.http.put<TaskItem>(`${environment.apiUrl}/tasks/${id}`, {
      ...currentTask,
      done: !currentTask.done,
    }));
    this.tasksSubject.next(this.snapshot.map((task) => task.id === id ? updatedTask : task));
  }

  async removeTask(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${environment.apiUrl}/tasks/${id}`));
    this.tasksSubject.next(this.snapshot.filter((task) => task.id !== id));
  }

  async updateTask(task: TaskItem): Promise<void> {
    const updatedTask = await firstValueFrom(this.http.put<TaskItem>(`${environment.apiUrl}/tasks/${task.id}`, task));
    this.tasksSubject.next(this.snapshot.map((item) => item.id === task.id ? updatedTask : item));
  }

  async replaceAll(tasks: TaskItem[]): Promise<void> {
    // Importacao em lote de tarefas externas (aula de integracao).
    await Promise.all(tasks.map((task) =>
      firstValueFrom(this.http.post<TaskItem>(`${environment.apiUrl}/tasks`, {
        title: task.title,
        description: task.description,
        done: task.done,
        priority: task.priority,
        dueDate: task.dueDate,
        reminderAt: task.reminderAt,
        photoDataUrl: task.photoDataUrl,
        latitude: task.latitude,
        longitude: task.longitude,
      })),
    ));
    await this.loadTasks();
  }
}
