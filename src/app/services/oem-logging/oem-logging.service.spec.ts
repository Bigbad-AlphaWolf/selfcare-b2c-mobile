import { TestBed } from '@angular/core/testing';

import { OemLoggingService } from './oem-logging.service';

describe('OemLoggingService', () => {
  let service: OemLoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OemLoggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
