import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPostpaidFixePage } from './dashboard-postpaid-fixe.page';

describe('DashboardPostpaidFixePage', () => {
  let component: DashboardPostpaidFixePage;
  let fixture: ComponentFixture<DashboardPostpaidFixePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardPostpaidFixePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPostpaidFixePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
