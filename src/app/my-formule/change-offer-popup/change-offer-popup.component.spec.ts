import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { FormuleService } from 'src/app/services/formule-service/formule.service';

import { ChangeOfferPopupComponent } from './change-offer-popup.component';

describe('ChangeOfferPopupComponent', () => {
  let component: ChangeOfferPopupComponent;
  let fixture: ComponentFixture<ChangeOfferPopupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChangeOfferPopupComponent],
        providers: [
          {
            provide: MatDialog,
            useValue: {},
          },
          {
            provide: FormuleService,
            useValue: {
              changerFormuleJamono: () => {
                return of();
              },
            },
          },
          {
            provide: AuthenticationService,
            useValue: {
              getSubscription: () => {
                return of();
              },
              deleteSubFromStorage: () => {
                return '';
              },
            },
          },
          {
            provide: DashboardService,
            useValue: {
              getCurrentPhoneNumber: () => {
                return '';
              },
            },
          },
          {
            provide: FollowAnalyticsService,
            useValue: {
              registerEventFollow: () => {
                return {};
              },
            },
          },
          {
            provide: ModalController,
            useValue: {
              registerEventFollow: () => {
                return {};
              },
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOfferPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
