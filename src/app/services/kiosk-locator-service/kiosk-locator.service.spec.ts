import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { KioskLocatorService } from './kiosk-locator.service';

describe('KioskLocatorService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: {},
        },
      ],
    })
  );

  it('should be created', () => {
    const service: KioskLocatorService = TestBed.get(KioskLocatorService);
    expect(service).toBeTruthy();
  });
});
