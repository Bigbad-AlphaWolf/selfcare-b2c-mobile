import { TestBed } from '@angular/core/testing';

import { FacebookEventService } from './facebook-event.service';

describe('FacebookEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FacebookEventService = TestBed.get(FacebookEventService);
    expect(service).toBeTruthy();
  });
});
