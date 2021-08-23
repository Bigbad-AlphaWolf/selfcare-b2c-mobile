import { TestBed } from '@angular/core/testing';

import { SargalService } from './sargal.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SargalService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient },
        { provide: HttpHandler, useValue: {} },
      ],
    })
  );

  it('should be created', () => {
    const service: SargalService = TestBed.get(SargalService);
    expect(service).toBeTruthy();
  });
});
