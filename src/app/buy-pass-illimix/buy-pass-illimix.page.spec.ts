import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyPassIllimixPage } from './buy-pass-illimix.page';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { of } from 'rxjs';
import { MatDialogRef, MatDialogModule } from '@angular/material';
import { ModalController } from '@ionic/angular';

describe('BuyPassIllimixPage', () => {
  let component: BuyPassIllimixPage;
  let fixture: ComponentFixture<BuyPassIllimixPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BuyPassIllimixPage],
      imports: [MatDialogModule],
      providers: [
        {
          provide: Router
        },
        {
          provide: ModalController
        },
        {
          provide: HttpClient
        },
        {
          provide: ActivatedRoute
        },
        {
          provide: DashboardService,
          useValue: {
            buyPassByCredit: () => {},
            getCurrentPhoneNumber: () => {}
          }
        },
        {
          provide: AuthenticationService,
          useValue: {
            getSubscription: () => {
              return of();
            }
          }
        },
        {
          provide: MatDialogRef
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyPassIllimixPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
