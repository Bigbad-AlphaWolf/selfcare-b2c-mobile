import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPostpaidFixeComponent } from './dashboard-postpaid-fixe.component';

describe('DashboardPostpaidComponent', () => {
  let component: DashboardPostpaidFixeComponent;
  let fixture: ComponentFixture<DashboardPostpaidFixeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPostpaidFixeComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPostpaidFixeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
