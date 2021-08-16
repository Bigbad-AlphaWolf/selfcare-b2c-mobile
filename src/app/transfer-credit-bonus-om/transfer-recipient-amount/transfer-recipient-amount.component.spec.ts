import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransferRecipientAmountComponent } from './transfer-recipient-amount.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { of } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Contacts } from '@ionic-native/contacts';
import { Router } from '@angular/router';

describe('TransferRecipientAmountComponent', () => {
  let component: TransferRecipientAmountComponent;
  let fixture: ComponentFixture<TransferRecipientAmountComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ TransferRecipientAmountComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MatDialog
        },
        {
          provide: Router
        },
        {
          provide: Contacts
        },
        {
          provide: DashboardService,
          useValue: {
            getCurrentPhoneNumber: () => {
              return ""
            }
          }
        },
        {
          provide: OrangeMoneyService,
          useValue: {
            getOmMsisdn: () => {
              return of()
            },
            checkBalanceSufficiency: () => {
              return of()
            },
            GetUserAuthInfo: () => {
              return of()
            },
            checkUserHasAccount: () => {
              return of()
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferRecipientAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
