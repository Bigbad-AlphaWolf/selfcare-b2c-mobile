import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectBeneficiaryPopUpComponent } from './select-beneficiary-pop-up.component';
import { MatDialog } from '@angular/material';
import { Contacts } from '@ionic-native/contacts';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { of } from 'rxjs';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';

describe('SelectBeneficiaryPopUpComponent', () => {
  let component: SelectBeneficiaryPopUpComponent;
  let fixture: ComponentFixture<SelectBeneficiaryPopUpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBeneficiaryPopUpComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MatDialog
        },
        {
          provide: Contacts
        },
        {
          provide: ModalController
        },
        {
          provide: Router
        },
        {
          provide: DashboardService,
          useValue: {
            getCurrentPhoneNumber: () => {
              return of()
            }
          }
        },
        {
          provide: OrangeMoneyService,
          useValue: {
            getOmMsisdn: () => {
              return of()
            },
            checkUserHasAccount: () => {
              return of()
            },
            GetUserAuthInfo: () => {
              return of()
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBeneficiaryPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
