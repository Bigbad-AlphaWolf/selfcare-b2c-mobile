import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { PurchaseService } from 'src/app/services/purchase-service/purchase.service';

import { HistorikTransactionByTypeModalComponent } from './historik-transaction-by-type-modal.component';

describe('HistorikTransactionByTypeModalComponent', () => {
  let component: HistorikTransactionByTypeModalComponent;
  let fixture: ComponentFixture<HistorikTransactionByTypeModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: ModalController,
          },
          {
            provide: DashboardService,
            useValue: {
              getCurrentPhoneNumber: () => {},
            },
          },
          {
            provide: PurchaseService,
            useValue: {
              getAllTransactionByDay: () => {
                return of();
              },
            },
          },
        ],
        declarations: [HistorikTransactionByTypeModalComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorikTransactionByTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
