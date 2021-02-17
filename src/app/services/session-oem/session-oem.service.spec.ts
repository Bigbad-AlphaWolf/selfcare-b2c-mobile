import { TestBed } from '@angular/core/testing';

import { SessionOem } from './session-oem.service';

describe('SessionOemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SessionOem = TestBed.get(SessionOem);
    expect(service).toBeTruthy();
  });
});
