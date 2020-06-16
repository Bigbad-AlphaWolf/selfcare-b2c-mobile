import { TestBed } from '@angular/core/testing';

import { MerchantPaymentService } from './merchant-payment.service';

describe('MerchantPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MerchantPaymentService = TestBed.get(MerchantPaymentService);
    expect(service).toBeTruthy();
  });
});
