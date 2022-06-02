import { TestBed } from '@angular/core/testing';

import { PassAbonnementWidoService } from './pass-abonnement-wido.service';

describe('PassAbonnementWidoService', () => {
  let service: PassAbonnementWidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassAbonnementWidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
