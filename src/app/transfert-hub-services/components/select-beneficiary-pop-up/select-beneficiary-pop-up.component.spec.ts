import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectBeneficiaryPopUpComponent } from './select-beneficiary-pop-up.component';
import { MatDialog } from '@angular/material';
import { Contacts } from '@ionic-native/contacts';
import { ModalController } from '@ionic/angular';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { of } from 'rxjs';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { AcronymPipe } from 'src/shared/pipes/acronym.pipe';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { RecentsService } from 'src/app/services/recents-service/recents.service';

describe('SelectBeneficiaryPopUpComponent', () => {
  let component: SelectBeneficiaryPopUpComponent;
  let fixture: ComponentFixture<SelectBeneficiaryPopUpComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          SelectBeneficiaryPopUpComponent,
          AcronymPipe,
          PhoneNumberDisplayPipe,
        ],
        imports: [RouterTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: MatDialog,
          },
          {
            provide: Contacts,
          },
          {
            provide: ModalController,
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
            provide: RecentsService,
            useValue: {
              fetchRecents: () => {
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
              checkUserHasAccount: () => {
                return of();
              },
              GetUserAuthInfo: () => {
                return of();
              },
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBeneficiaryPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
