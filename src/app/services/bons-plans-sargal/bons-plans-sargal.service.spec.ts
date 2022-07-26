import { TestBed } from '@angular/core/testing';

import { BonsPlansSargalService } from './bons-plans-sargal.service';

describe('BonsPlansSargalService', () => {
  let service: BonsPlansSargalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonsPlansSargalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
