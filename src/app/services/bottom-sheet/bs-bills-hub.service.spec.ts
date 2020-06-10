import { TestBed } from '@angular/core/testing';

import { BsBillsHubService } from './bs-bills-hub.service';

describe('BsBillsHubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BsBillsHubService = TestBed.get(BsBillsHubService);
    expect(service).toBeTruthy();
  });
});
