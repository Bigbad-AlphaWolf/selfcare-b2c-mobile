import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardKirenePage } from './dashboard-kirene.page';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';
import { HttpClient } from '@angular/common/http';
import { Router, UrlSerializer } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { BanniereService } from '../services/banniere-service/banniere.service';
import { AssistanceService } from '../services/assistance.service';
import { SargalService } from '../services/sargal-service/sargal.service';
import { ModalController } from '@ionic/angular';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../services/bottom-sheet/bottom-sheet.service';

describe('DashboardKirenePage', () => {
  let component: DashboardKirenePage;
  let fixture: ComponentFixture<DashboardKirenePage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DashboardKirenePage, FormatCurrencyPipe],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: DashboardService,
            useValue: {
              getUserConsoInfosByCode: () => {
                return of({});
              },
              getAccountInfo: () => {
                return of({});
              },
              getWelcomeStatus: () => {
                return of({});
              },
              getActivePromoBooster: () => {
                return of({});
              },
              getCurrentPhoneNumber: () => {
                return '';
              },
              getMainPhoneNumber: () => {
                return '';
              },
            },
          },
          {
            provide: AuthenticationService,
            useValue: {
              getSubscription: () => {
                return of({});
              },
              logout: () => {},
            },
          },
          {
            provide: BanniereService,
            useValue: {
              getStatusLoadingBanniere: () => {
                return of({});
              },
              setListBanniereByFormule: () => {},
              getListBanniereByFormule: () => {
                return of({});
              },
              getListBanniereByFormuleByZone: () => {
                return of({});
              },
            },
          },
          {
            provide: AssistanceService,
            useValue: {
              tutoViewed: () => {
                return of({});
              },
            },
          },
          {
            provide: SargalService,
            useValue: {
              getSargalBalance: () => {
                return of({});
              },
            },
          },
          { provide: Router, useValue: {} },
          { provide: UrlSerializer },
          { provide: MatBottomSheet, useValue: {} },
          { provide: MatDialog, useValue: {} },
          {
            provide: HttpClient,
            useValue: {},
          },
          {
            provide: ModalController,
            useValue: {},
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardKirenePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
