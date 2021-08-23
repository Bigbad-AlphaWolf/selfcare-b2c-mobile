import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardHomePrepaidPage } from './dashboard-home-prepaid.page';
import { PassVolumeDisplayPipe } from 'src/shared/pipes/pass-volume-display.pipe';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

describe('DashboardHomePrepaidPage', () => {
  let component: DashboardHomePrepaidPage;
  let fixture: ComponentFixture<DashboardHomePrepaidPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardHomePrepaidPage, PassVolumeDisplayPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: HttpClient,
          useValue: {
            get: () => {
              return of({});
            },
          },
        },
        { provide: Router, useValue: {} },
        { provide: MatDialog, useValue: {} },
      ],
    }).compileComponents();
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
