import { TestBed } from '@angular/core/testing';

import { IlliflexService } from './illiflex.service';

describe('IlliflexService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IlliflexService = TestBed.get(IlliflexService);
    expect(service).toBeTruthy();
  });
});
