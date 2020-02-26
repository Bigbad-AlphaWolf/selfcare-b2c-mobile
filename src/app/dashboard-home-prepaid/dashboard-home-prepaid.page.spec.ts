import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHomePrepaidPage } from './dashboard-home-prepaid.page';

describe('DashboardHomePrepaidPage', () => {
  let component: DashboardHomePrepaidPage;
  let fixture: ComponentFixture<DashboardHomePrepaidPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardHomePrepaidPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHomePrepaidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
