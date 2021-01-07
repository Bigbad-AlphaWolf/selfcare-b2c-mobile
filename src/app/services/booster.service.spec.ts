import { TestBed } from '@angular/core/testing';

import { BoosterService } from './booster.service';

describe('BoosterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoosterService = TestBed.get(BoosterService);
    expect(service).toBeTruthy();
  });
});
