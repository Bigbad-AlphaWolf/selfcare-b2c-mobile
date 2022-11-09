import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransfertHubServicesPage } from './transfert-hub-services.page';
import { AngularDelegate, ModalController, ToastController } from '@ionic/angular';
import { Contacts } from '@ionic-native/contacts';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { OfferPlansService } from '../services/offer-plans-service/offer-plans.service';
import { of } from 'rxjs';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '../services/bottom-sheet/bottom-sheet.service';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { FavorisService } from '../services/favoris/favoris.service';
import { OperationService } from '../services/oem-operation/operation.service';

describe('TransfertHubServicesPage', () => {
  let component: TransfertHubServicesPage;
  let fixture: ComponentFixture<TransfertHubServicesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [TransfertHubServicesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AngularDelegate,
        {
          provide: ModalController,
        },
        {
          provide: ToastController,
        },
        {
          provide: Location,
        },
        {
          provide: MatBottomSheet,
        },
        {
          provide: OfferPlansService,
          useValue: {
            getUserTypeOfferPlans: () => {
              return of();
            },
          },
        },
        {
          provide: OperationService,
          useValue: {
            getServicesByFormule: () => {
              return of();
            },
          },
        },
        {
          provide: FavorisService,
          useValue: {
            getFavoritePass: () => {
              return of();
            },
          },
        },
        {
          provide: BottomSheetService,
          useValue: {
            openNumberSelectionBottomSheet: () => {},
          },
        },
        {
          provide: DashboardService,
          useValue: {
            getCurrentPhoneNumber: () => {
              return '';
            },
            getActivePromoBooster: () => {
              return of();
            },
          },
        },
        {
          provide: OrangeMoneyService,
          useValue: {
            getOmMsisdn: () => {
              return of();
            },
            omAccountSession: () => {
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
              return '';
            },
          },
        },
        {
          provide: ModalController,
        },
        {
          provide: Contacts,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfertHubServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
