import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardPrepaidHybridPage } from './dashboard-prepaid-hybrid.page';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Router, UrlSerializer } from '@angular/router';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { PassVolumeDisplayPipe } from 'src/shared/pipes/pass-volume-display.pipe';
import { FormatBillNumPipe } from 'src/shared/pipes/format-bill-num.pipe';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';
import { FormatBillDatePipe } from 'src/shared/pipes/format-bill-date.pipe';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('DashboardPrepaidHybridPage', () => {
  let component: DashboardPrepaidHybridPage;
  let fixture: ComponentFixture<DashboardPrepaidHybridPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          DashboardPrepaidHybridPage,
          PassVolumeDisplayPipe,
          FormatBillNumPipe,
          FormatCurrencyPipe,
          FormatBillDatePipe,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule, ReactiveFormsModule, FormsModule],
        providers: [
          {
            provide: HttpClient,
            useValue: {
              get: () => {
                return of({});
              },
            },
          },
          { provide: MatDialog, useValue: {} },
          { provide: File },
          { provide: InAppBrowser },
          { provide: ModalController },
          { provide: Location },
          { provide: UrlSerializer },
          { provide: AppVersion },
          { provide: MatBottomSheet },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardPrepaidHybridPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
