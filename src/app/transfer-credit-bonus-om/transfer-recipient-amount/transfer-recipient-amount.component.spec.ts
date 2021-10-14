import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {TransferRecipientAmountComponent} from './transfer-recipient-amount.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {OrangeMoneyService} from 'src/app/services/orange-money-service/orange-money.service';
import {of} from 'rxjs';
import {DashboardService} from 'src/app/services/dashboard-service/dashboard.service';
import {Contacts} from '@ionic-native/contacts';
import {UrlSerializer} from '@angular/router';
import {Location} from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';
import {FollowAnalyticsService} from 'src/app/services/follow-analytics/follow-analytics.service';
import {AuthenticationService} from 'src/app/services/authentication-service/authentication.service';
import {AngularDelegate, ModalController} from '@ionic/angular';
import {OverlayModule} from '@angular/cdk/overlay';

describe('TransferRecipientAmountComponent', () => {
  let component: TransferRecipientAmountComponent;
  let fixture: ComponentFixture<TransferRecipientAmountComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, OverlayModule, MatDialogModule],
        declarations: [TransferRecipientAmountComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          AngularDelegate,
          {
            provide: MatDialog
          },
          {
            provide: Location
          },
          {
            provide: ModalController
          },
          {
            provide: UrlSerializer
          },
          {
            provide: Contacts
          },
          {
            provide: DashboardService,
            useValue: {
              getCurrentPhoneNumber: () => {
                return '';
              }
            }
          },
          {
            provide: AuthenticationService,
            useValue: {
              canRecieveCredit: () => {
                return of();
              }
            }
          },
          {
            provide: FollowAnalyticsService,
            useValue: {
              registerEventFollow: () => {
                return '';
              }
            }
          },
          {
            provide: OrangeMoneyService,
            useValue: {
              getOmMsisdn: () => {
                return of();
              },
              checkBalanceSufficiency: () => {
                return of();
              },
              GetUserAuthInfo: () => {
                return of();
              },
              checkUserHasAccount: () => {
                return of();
              }
            }
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferRecipientAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
