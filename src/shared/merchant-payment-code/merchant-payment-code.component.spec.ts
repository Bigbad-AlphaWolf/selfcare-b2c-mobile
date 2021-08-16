import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MerchantPaymentCodeComponent } from './merchant-payment-code.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('MerchantPaymentCodeComponent', () => {
  let component: MerchantPaymentCodeComponent;
  let fixture: ComponentFixture<MerchantPaymentCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [MerchantPaymentCodeComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: OrangeMoneyService,
          useValue: {
            getMerchantByCode: () => {
              return of();
            },
          },
        },
        {
          provide: Router,
          useValue: {},
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantPaymentCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
