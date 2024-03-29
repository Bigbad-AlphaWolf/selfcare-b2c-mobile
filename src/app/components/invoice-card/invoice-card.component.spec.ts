import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { BillsService } from 'src/app/services/bill-service/bills.service';
import { FormatBillDatePipe } from 'src/shared/pipes/format-bill-date.pipe';
import { FormatBillNumPipe } from 'src/shared/pipes/format-bill-num.pipe';
import { GetLabelLigneBillBordereauPipe } from 'src/shared/pipes/get-label-ligne-bill-bordereau.pipe';

import { InvoiceCardComponent } from './invoice-card.component';

describe('InvoiceCardComponent', () => {
  let component: InvoiceCardComponent;
  let fixture: ComponentFixture<InvoiceCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BillsService,
          useValue: {
            downloadBill: () => {},
          },
        },
        {
          provide: ModalController,
        },
      ],
      declarations: [InvoiceCardComponent, GetLabelLigneBillBordereauPipe, FormatBillNumPipe, FormatBillDatePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
