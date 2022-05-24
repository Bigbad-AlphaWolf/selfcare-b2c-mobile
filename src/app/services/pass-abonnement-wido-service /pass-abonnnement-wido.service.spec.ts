import { TestBed } from '@angular/core/testing';

import { PassAbonnnementWidoService } from './pass-abonnnement-wido.service';

describe('PassAbonnnementWidoService', () => {
  let service: PassAbonnnementWidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassAbonnnementWidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
