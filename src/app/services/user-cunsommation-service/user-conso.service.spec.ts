import { TestBed } from '@angular/core/testing';

import { UserConsoService } from './user-conso.service';

describe('UserConsoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserConsoService = TestBed.get(UserConsoService);
    expect(service).toBeTruthy();
  });
});
