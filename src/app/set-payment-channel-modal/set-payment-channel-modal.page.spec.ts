import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SetPaymentChannelModalPage } from './set-payment-channel-modal.page';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { of } from 'rxjs';

describe('SetPaymentChannelModalPage', () => {
  let component: SetPaymentChannelModalPage;
  let fixture: ComponentFixture<SetPaymentChannelModalPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SetPaymentChannelModalPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          AngularDelegate,
          {
            provide: ModalController,
          },
          {
            provide: DashboardService,
            useValue: {
              getUserConsoInfosByCode: () => {
                return of();
              },
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPaymentChannelModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
