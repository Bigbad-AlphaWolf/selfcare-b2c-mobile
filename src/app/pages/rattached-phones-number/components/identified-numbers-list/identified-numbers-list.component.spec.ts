import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { AccountService } from 'src/app/services/account-service/account.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';

import { IdentifiedNumbersListComponent } from './identified-numbers-list.component';

describe('IdentifiedNumbersListComponent', () => {
  let component: IdentifiedNumbersListComponent;
  let fixture: ComponentFixture<IdentifiedNumbersListComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [IdentifiedNumbersListComponent, PhoneNumberDisplayPipe],
        providers: [
          AngularDelegate,
          {
            provide: AccountService,
            useValue: {
              fetchIdentifiedNumbers: () => {
                return of();
              },
            },
          },
          {
            provide: DashboardService,
            useValue: {
              getAllOemNumbers: () => {
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
    fixture = TestBed.createComponent(IdentifiedNumbersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
