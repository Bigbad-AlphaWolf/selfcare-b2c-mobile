import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPostpaidPage } from './dashboard-postpaid.page';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { PassVolumeDisplayPipe } from 'src/shared/pipes/pass-volume-display.pipe';
import { FormatBillNumPipe } from 'src/shared/pipes/format-bill-num.pipe';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';
import { FormatBillDatePipe } from 'src/shared/pipes/format-bill-date.pipe';
import { File } from '@ionic-native/file/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

describe('DashboardPostpaidPage', () => {
  let component: DashboardPostpaidPage;
  let fixture: ComponentFixture<DashboardPostpaidPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardPostpaidPage,
        PassVolumeDisplayPipe,
        FormatBillNumPipe,
        FormatCurrencyPipe,
        FormatBillDatePipe,
      ],
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
        { provide: File },
        { provide: InAppBrowser },
        { provide: PassVolumeDisplayPipe },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPostpaidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
