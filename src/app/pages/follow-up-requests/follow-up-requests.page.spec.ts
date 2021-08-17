import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { RequestOemService } from 'src/app/services/request-oem/request-oem.service';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';

import { FollowUpRequestsPage } from './follow-up-requests.page';

describe('FollowUpRequestsPage', () => {
  let component: FollowUpRequestsPage;
  let fixture: ComponentFixture<FollowUpRequestsPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FollowUpRequestsPage, PhoneNumberDisplayPipe],
        providers: [
          {
            provide: DashboardService,
            useValue: {
              fetchFixedNumbers: () => {
                return of();
              },
              getMainPhoneNumber: () => {
                return '';
              },
            },
          },
          {
            provide: RequestOemService,
            useValue: {
              fetchRequests: () => {
                return of();
              },
            },
          },
          {
            provide: Location,
          },
          {
            provide: UrlSerializer,
          },
          {
            provide: FollowAnalyticsService,
            useValue: {
              registerEventFollow: () => {
                return '';
              },
            },
          },
          {
            provide: ModalController,
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowUpRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
