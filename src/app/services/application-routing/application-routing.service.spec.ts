import { TestBed } from '@angular/core/testing';

import { ApplicationRoutingService } from './application-routing.service';

describe('ApplicationRoutingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicationRoutingService = TestBed.get(ApplicationRoutingService);
    expect(service).toBeTruthy();
  });
});
