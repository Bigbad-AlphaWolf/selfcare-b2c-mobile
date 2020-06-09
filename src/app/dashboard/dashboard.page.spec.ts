import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPage } from './dashboard.page';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { MatDialog } from '@angular/material';

describe('DashboardPage', () => {
  let component: DashboardPage;
  let fixture: ComponentFixture<DashboardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: HttpClient },
        {
          provide: Router,
        },
        {
          provide: AppMinimize,
        },
        {
          provide: AppVersion,
        },
        {
          provide: MatDialog,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
