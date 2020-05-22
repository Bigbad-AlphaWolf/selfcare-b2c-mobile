import { TestBed } from '@angular/core/testing';

import { OfferPlansService } from './offer-plans.service';

describe('OfferPlansService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OfferPlansService = TestBed.get(OfferPlansService);
    expect(service).toBeTruthy();
  });
});
