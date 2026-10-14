import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksPage } from './tasks.page';

const routes: Routes = [
  {
    path: '',
    component: TasksPage,
  },
  {
    path: ':id',
    loadChildren: () =>
      import('../task-detail/task-detail.module').then((m) => m.TaskDetailPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksPageRoutingModule {}
