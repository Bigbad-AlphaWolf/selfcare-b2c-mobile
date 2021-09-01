import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OmButtonComponent } from './om-button.component';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { of } from 'rxjs';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { ModalController } from '@ionic/angular';

describe('OmButtonComponent', () => {
  let component: OmButtonComponent;
  let fixture: ComponentFixture<OmButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OmButtonComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Router,
          useValue: {}
        },
        {
          provide: DashboardService,
          useValue: {
            balanceAvailableSubject: of()
          }
        },
        {
          provide: OrangeMoneyService,
          useValue: {
            balanceVisibilityEMitted: () => {
              return of()
            },
            GetOrangeMoneyUser: () => {
              return ""
            },
            showBalance: () => {
              return ""
            }
         }
        },
        {
          provide: ModalController,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
