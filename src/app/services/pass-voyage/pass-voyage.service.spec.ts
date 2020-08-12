import { TestBed } from '@angular/core/testing';

import { PassVoyageService } from './pass-voyage.service';

describe('PassVoyageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PassVoyageService = TestBed.get(PassVoyageService);
    expect(service).toBeTruthy();
  });
});
