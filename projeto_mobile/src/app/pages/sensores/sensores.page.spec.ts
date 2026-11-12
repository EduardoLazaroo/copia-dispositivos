import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SensoresPage } from './sensores.page';

describe('SensoresPage', () => {
  let component: SensoresPage;
  let fixture: ComponentFixture<SensoresPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SensoresPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SensoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
