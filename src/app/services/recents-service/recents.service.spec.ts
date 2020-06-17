import { TestBed } from '@angular/core/testing';

import { RecentsService } from './recents.service';

describe('RecentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecentsService = TestBed.get(RecentsService);
    expect(service).toBeTruthy();
  });
});
