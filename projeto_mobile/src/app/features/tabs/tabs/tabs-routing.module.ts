import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tasks',
        loadChildren: () =>
          import('../../tasks/tasks/tasks.module').then((m) => m.TasksPageModule),
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('../../calendar/calendar/calendar.module').then((m) => m.CalendarPageModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../../settings/settings/settings.module').then((m) => m.SettingsPageModule),
      },
      {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
