import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { PreferencesService } from './core/services/preferences.service';
import { TaskService } from './core/services/task.service';

import { AppComponent } from './app.component';

describe('AppComponent', () => {

  beforeEach(async () => {
    const authMock = {
      restoreSession: jasmine.createSpy('restoreSession').and.resolveTo(),
      session$: of(null),
    };

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

    const routerMock = {
      navigateByUrl: jasmine.createSpy('navigateByUrl').and.resolveTo(true),
    };

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: TaskService, useValue: taskMock },
        { provide: PreferencesService, useValue: preferencesMock },
        { provide: Router, useValue: routerMock },
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
