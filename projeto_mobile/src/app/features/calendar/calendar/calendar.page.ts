import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaskItem } from '../../../core/models/task.model';
import { TaskService } from '../../../core/services/task.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: false,
})
export class CalendarPage implements OnInit, OnDestroy {
  private readonly taskService = inject(TaskService);

  tasksWithDate: TaskItem[] = [];
  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.taskService.tasks$.subscribe((tasks) => {
      this.tasksWithDate = tasks
        .filter((task) => Boolean(task.dueDate))
        .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''));
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
