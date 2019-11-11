import { TestBed } from '@angular/core/testing';

import { FollowAnalyticsService } from './follow-analytics.service';

describe('FollowAnalyticsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FollowAnalyticsService = TestBed.get(FollowAnalyticsService);
    expect(service).toBeTruthy();
  });
});
