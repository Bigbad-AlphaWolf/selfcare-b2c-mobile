import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardKirenePage } from './dashboard-kirene.page';

describe('DashboardKirenePage', () => {
  let component: DashboardKirenePage;
  let fixture: ComponentFixture<DashboardKirenePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardKirenePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardKirenePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
