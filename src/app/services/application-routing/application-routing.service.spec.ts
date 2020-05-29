import { TestBed } from '@angular/core/testing';

import { ApplicationRoutingService } from './application-routing.service';
import { Router } from '@angular/router';

describe('ApplicationRoutingService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [{ provide: Router }],
    })
  );

  it('should be created', () => {
    const service: ApplicationRoutingService = TestBed.get(
      ApplicationRoutingService
    );
    expect(service).toBeTruthy();
  });
});
