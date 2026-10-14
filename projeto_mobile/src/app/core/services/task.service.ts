import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskItem, TaskPriority } from '../models/task.model';
import { LocalDatabaseService } from './local-database.service';

const STORAGE_KEY = 'pm_tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly localDb = inject(LocalDatabaseService);

  private readonly tasksSubject = new BehaviorSubject<TaskItem[]>([]);
  readonly tasks$ = this.tasksSubject.asObservable();

  get snapshot(): TaskItem[] {
    return this.tasksSubject.value;
  }

  clear(): void {
    this.tasksSubject.next([]);
    this.localDb.remove(STORAGE_KEY);
  }

  async loadTasks(): Promise<void> {
    // Semana 12: Carga inicial de estado persistido com Ionic Storage.
    const persisted = await this.localDb.get<TaskItem[]>(STORAGE_KEY);
    if (persisted && persisted.length > 0) {
      this.tasksSubject.next(persisted);
      return;
    }

    try {
      // Tenta carregar da API (Semana 09/10).
      const tasks = await firstValueFrom(this.http.get<TaskItem[]>(`${environment.apiUrl}/tasks`));
      this.tasksSubject.next(tasks);
      await this.persist(tasks);
    } catch {
      // Se offline ou sem backend, mantem lista local.
      this.tasksSubject.next(persisted ?? []);
    }
  }

  async addTask(title: string, description: string, priority: TaskPriority, dueDate?: string): Promise<void> {
    const now = new Date().toISOString();
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      done: false,
      priority,
      dueDate,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const created = await firstValueFrom(this.http.post<TaskItem>(`${environment.apiUrl}/tasks`, {
        title: newTask.title,
        description: newTask.description,
        done: false,
        priority,
        dueDate,
      }));
      const updatedList = [created, ...this.snapshot];
      this.tasksSubject.next(updatedList);
      await this.persist(updatedList);
    } catch {
      const updatedList = [newTask, ...this.snapshot];
      this.tasksSubject.next(updatedList);
      await this.persist(updatedList);
    }
  }

  async toggleDone(id: string): Promise<void> {
    const currentTask = this.snapshot.find((task) => task.id === id);
    if (!currentTask) return;

    const toggled: TaskItem = {
      ...currentTask,
      done: !currentTask.done,
      updatedAt: new Date().toISOString(),
    };

    try {
      await firstValueFrom(this.http.put<TaskItem>(`${environment.apiUrl}/tasks/${id}`, toggled));
    } catch {
      // Modo offline/local
    }

    const updatedList = this.snapshot.map((task) => (task.id === id ? toggled : task));
    this.tasksSubject.next(updatedList);
    await this.persist(updatedList);
  }

  async removeTask(id: string): Promise<void> {
    try {
      await firstValueFrom(this.http.delete<void>(`${environment.apiUrl}/tasks/${id}`));
    } catch {
      // Modo offline/local
    }

    const updatedList = this.snapshot.filter((task) => task.id !== id);
    this.tasksSubject.next(updatedList);
    await this.persist(updatedList);
  }

  async updateTask(task: TaskItem): Promise<void> {
    try {
      await firstValueFrom(this.http.put<TaskItem>(`${environment.apiUrl}/tasks/${task.id}`, task));
    } catch {
      // Modo offline/local
    }

    const updatedList = this.snapshot.map((item) => (item.id === task.id ? task : item));
    this.tasksSubject.next(updatedList);
    await this.persist(updatedList);
  }

  async replaceAll(tasks: TaskItem[]): Promise<void> {
    // Importacao em lote de tarefas externas (aula de integracao).
    this.tasksSubject.next(tasks);
    await this.persist(tasks);

    try {
      await Promise.all(
        tasks.map((task) =>
          firstValueFrom(
            this.http.post<TaskItem>(`${environment.apiUrl}/tasks`, {
              title: task.title,
              description: task.description,
              done: task.done,
              priority: task.priority,
              dueDate: task.dueDate,
            }),
          ),
        ),
      );
    } catch {
      // Persistido localmente com sucesso
    }
  }

  private async persist(tasks: TaskItem[]): Promise<void> {
    await this.localDb.set(STORAGE_KEY, tasks);
  }
}
