import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';

import { TypeOtpModalComponent } from './type-otp-modal.component';

describe('TypeOtpModalComponent', () => {
  let component: TypeOtpModalComponent;
  let fixture: ComponentFixture<TypeOtpModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          TypeOtpModalComponent,
          PhoneNumberDisplayPipe,
          PhoneNumberDisplayPipe,
        ],
        providers: [
          {
            provide: OrangeMoneyService,
            useValue: {
              initSelfOperationOtp: () => {
                return of();
              },
              checkSelfOperationOtp: () => {
                return of();
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
            provide: ModalController,
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeOtpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
