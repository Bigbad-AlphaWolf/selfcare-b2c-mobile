import { TestBed } from '@angular/core/testing';

import { PurchaseService } from './purchase.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('PurchaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: HttpClient,
        useValue: {
          get:() => {
            return of()
          }
        }
      }
    ]
  }));

  it('should be created', () => {
    const service: PurchaseService = TestBed.get(PurchaseService);
    expect(service).toBeTruthy();
  });
});
