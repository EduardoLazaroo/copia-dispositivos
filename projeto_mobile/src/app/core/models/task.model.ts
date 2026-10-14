export type TaskPriority = 'baixa' | 'media' | 'alta';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  done: boolean;
  priority: TaskPriority;
  dueDate?: string;
  reminderAt?: string;
  photoDataUrl?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}
