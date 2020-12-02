import { TestBed } from '@angular/core/testing';

import { DalalTonesService } from './dalal-tones.service';

describe('DalalTonesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DalalTonesService = TestBed.get(DalalTonesService);
    expect(service).toBeTruthy();
  });
});
