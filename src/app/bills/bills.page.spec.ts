import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsPage } from './bills.page';
import { FormatBillNumPipe } from 'src/shared/pipes/format-bill-num.pipe';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';
import { FormatBillDatePipe } from 'src/shared/pipes/format-bill-date.pipe';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { File } from '@ionic-native/file/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

fdescribe('BillsPage', () => {
  let component: BillsPage;
  let fixture: ComponentFixture<BillsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BillsPage,
        FormatBillNumPipe,
        FormatCurrencyPipe,
        FormatBillDatePipe,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: File, useValue: {} },
        { provide: InAppBrowser, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
