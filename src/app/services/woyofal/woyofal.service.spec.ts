import { TestBed } from '@angular/core/testing';

import { WoyofalService } from './woyofal.service';

describe('WoyofalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WoyofalService = TestBed.get(WoyofalService);
    expect(service).toBeTruthy();
  });
});
