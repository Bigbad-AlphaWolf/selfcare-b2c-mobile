import { TestBed } from '@angular/core/testing';

import { SessionOemService } from './session-oem.service';

describe('SessionOemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SessionOemService = TestBed.get(SessionOemService);
    expect(service).toBeTruthy();
  });
});
