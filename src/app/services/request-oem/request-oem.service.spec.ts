import { TestBed } from '@angular/core/testing';

import { RequestOemService } from './request-oem.service';

describe('RequestOemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequestOemService = TestBed.get(RequestOemService);
    expect(service).toBeTruthy();
  });
});
