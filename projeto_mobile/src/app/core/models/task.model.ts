export type TaskPriority = 'baixa' | 'media' | 'alta';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  done: boolean;
  priority: TaskPriority;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
