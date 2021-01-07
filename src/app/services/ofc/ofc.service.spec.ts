import { TestBed } from '@angular/core/testing';

import { OfcService } from './ofc.service';

describe('OfcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OfcService = TestBed.get(OfcService);
    expect(service).toBeTruthy();
  });
});
