import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationRecapPage } from './operation-recap.page';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { of } from 'rxjs';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { Location } from '@angular/common';

describe('OperationRecapPage', () => {
  let component: OperationRecapPage;
  let fixture: ComponentFixture<OperationRecapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationRecapPage, PhoneNumberDisplayPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ModalController
        },
        {
          provide: ActivatedRoute
        },
        {
          provide: Router
        },
        {
          provide: Location
        },
        {
          provide: UrlSerializer
        },
        {
          provide: DashboardService,
          useValue: {
            getCurrentPhoneNumber: () => {
              return ""
            },
            buyPassByCredit: () => {
              return of()
            }
          }
        },
        {
          provide: OrangeMoneyService,
          useValue: {
            getOrangeMoneyNumber: () => {
              return of()
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationRecapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
