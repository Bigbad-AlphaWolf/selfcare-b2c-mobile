import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardKirenePage } from './dashboard-kirene.page';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { of } from 'rxjs';

describe('DashboardKirenePage', () => {
  let component: DashboardKirenePage;
  let fixture: ComponentFixture<DashboardKirenePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardKirenePage, FormatCurrencyPipe],
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
    fixture = TestBed.createComponent(DashboardKirenePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
