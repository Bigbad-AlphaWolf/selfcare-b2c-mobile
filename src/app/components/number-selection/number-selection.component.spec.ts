import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { AcronymPipe } from 'src/shared/pipes/acronym.pipe';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';

import { NumberSelectionComponent } from './number-selection.component';

describe('NumberSelectionComponent', () => {
  let component: NumberSelectionComponent;
  let fixture: ComponentFixture<NumberSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModalController
        },
        {
          provide: OrangeMoneyService,
          useValue: {
            getOmMsisdn: () => {
              return of()
            }
          }
        },
        {
          provide: AuthenticationService,
          useValue: {
            checkUserEligibility: () => {
              return of()
            },
            getSubscriptionForTiers: () => {
              return of()
            },
            canRecieveCredit: () => {
              return of()
            }
          }
        },
        {
          provide: RecentsService,
          useValue: {
            fetchRecents: () => {
              return of()
            }
          }
        },
        {
          provide: FollowAnalyticsService,
          useValue: {
            registerEventFollow: () => {}
          }
        },
        {
          provide: ChangeDetectorRef
        },
        {
          provide: DashboardService,
          useValue: {
            fetchOemNumbers: () => {
              return of()
            }
          }
        }
      ],
      declarations: [ NumberSelectionComponent, PhoneNumberDisplayPipe, AcronymPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
