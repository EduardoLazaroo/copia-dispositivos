import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PreferencesService } from './core/services/preferences.service';
import { TaskService } from './core/services/task.service';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    const taskMock = {
      loadTasks: jasmine.createSpy('loadTasks').and.resolveTo(),
    };

    const preferencesMock = {
      load: jasmine.createSpy('load').and.resolveTo({
        displayName: 'estudante',
        showCompleted: true,
        darkMode: false,
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: TaskService, useValue: taskMock },
        { provide: PreferencesService, useValue: preferencesMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
