import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OperationRecapPage } from './operation-recap.page';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { of } from 'rxjs';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { Location } from '@angular/common';
import { CodeFormatPipe } from '../pipes/code-format/code-format.pipe';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { PassInternetService } from '../services/pass-internet-service/pass-internet.service';
import { DalalTonesService } from '../services/dalal-tones-service/dalal-tones.service';
import { IlliflexService } from '../services/illiflex-service/illiflex.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { FeesService } from '../services/fees/fees.service';

describe('OperationRecapPage', () => {
  let component: OperationRecapPage;
  let fixture: ComponentFixture<OperationRecapPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          OperationRecapPage,
          PhoneNumberDisplayPipe,
          CodeFormatPipe,
          FormatCurrencyPipe,
        ],
        imports: [RouterTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          AngularDelegate,
          {
            provide: ModalController,
          },
          {
            provide: UrlSerializer,
          },
          {
            provide: DashboardService,
            useValue: {
              getCurrentPhoneNumber: () => {
                return '';
              },
              buyPassByCredit: () => {
                return of();
              },
            },
          },
          {
            provide: OrangeMoneyService,
            useValue: {
              getOrangeMoneyNumber: () => {
                return of();
              },
              checkUserHasAccount: () => {
                return of();
              },
            },
          },
          {
            provide: PassInternetService,
            useValue: {
              getPassByPPI: () => {
                return of();
              },
            },
          },
          {
            provide: FeesService,
            useValue: {
              getFeesByOMService: () => {
                return of();
              },
            },
          },
          {
            provide: AuthenticationService,
            useValue: {
              getSubscriptionForTiers: () => {
                return of();
              },
              getHmac: () => {
                return of();
              },
            },
          },
          {
            provide: IlliflexService,
            useValue: {
              buyIlliflex: () => {
                return of();
              },
            },
          },
          {
            provide: DalalTonesService,
            useValue: {
              activateDalal: () => {
                return of();
              },
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationRecapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
