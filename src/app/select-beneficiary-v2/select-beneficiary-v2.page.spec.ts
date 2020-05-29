import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBeneficiaryV2Page } from './select-beneficiary-v2.page';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { of } from 'rxjs';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Contacts } from '@ionic-native/contacts';

describe('SelectBeneficiaryV2Page', () => {
  let component: SelectBeneficiaryV2Page;
  let fixture: ComponentFixture<SelectBeneficiaryV2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBeneficiaryV2Page, PhoneNumberDisplayPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            getCurrentPhoneNumber:() => {
              return ""
            },
            getMainPhoneNumber:() => {
              return ""
            },
            getAttachedNumbers:() => {
              return of()
            }
          }
        },
        {
          provide: AuthenticationService,
          useValue: {
            getSubscription:() => {
              return of()
            }
          }
        },
        {
          provide: Router
        },
        {
          provide: MatDialog
        },
        {
          provide: Contacts
        },
        {
          provide: ActivatedRoute
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBeneficiaryV2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
