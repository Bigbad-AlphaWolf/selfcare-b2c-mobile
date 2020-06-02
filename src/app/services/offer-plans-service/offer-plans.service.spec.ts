import { TestBed } from '@angular/core/testing';

import { OfferPlansService } from './offer-plans.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('OfferPlansService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: HttpClient,
        useValue: {
          get: () => {
            return of()
          }
        }
      }
    ]
  }));

  it('should be created', () => {
    const service: OfferPlansService = TestBed.get(OfferPlansService);
    expect(service).toBeTruthy();
  });
});
