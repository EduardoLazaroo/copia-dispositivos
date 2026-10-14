import { Component, inject } from '@angular/core';
import { PreferencesService } from './core/services/preferences.service';
import { TaskService } from './core/services/task.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  private readonly preferencesService = inject(PreferencesService);
  private readonly taskService = inject(TaskService);

  displayName = 'estudante';

  constructor() {
    // Inicializa preferencias e carga de dados locais ao abrir o app.
    this.bootstrapApplication();
  }

  private async bootstrapApplication(): Promise<void> {
    const preferences = await this.preferencesService.load();
    this.displayName = preferences.displayName;
    document.body.classList.toggle('dark', preferences.darkMode);

    // Carga inicial das tarefas (persistencia local e API).
    await this.taskService.loadTasks();
  }
}
