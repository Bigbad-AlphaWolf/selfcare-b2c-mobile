import { TestBed } from '@angular/core/testing';

import { RapidoService } from './rapido.service';

describe('RapidoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RapidoService = TestBed.get(RapidoService);
    expect(service).toBeTruthy();
  });
});
