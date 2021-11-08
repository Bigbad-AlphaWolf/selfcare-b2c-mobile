import { TestBed } from '@angular/core/testing';

import { BatchAnalyticsService } from './batch-analytics.service';

describe('BatchAnalyticsService', () => {
  let service: BatchAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
