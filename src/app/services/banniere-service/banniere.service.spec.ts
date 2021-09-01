import { TestBed } from '@angular/core/testing';

import { BanniereService } from './banniere.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('BanniereService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient }, { provide: HttpHandler }],
    })
  );

  it('should be created', () => {
    const service: BanniereService = TestBed.get(BanniereService);
    expect(service).toBeTruthy();
  });
});
