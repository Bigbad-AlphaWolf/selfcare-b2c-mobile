import { TestBed } from '@angular/core/testing';

import { PassInternetService } from './pass-internet.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('PassInternetService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient },
        { provide: HttpHandler, useValue: {} },
      ],
    })
  );

  it('should be created', () => {
    const service: PassInternetService = TestBed.get(PassInternetService);
    expect(service).toBeTruthy();
  });
});
