import { TestBed } from '@angular/core/testing';

import { EyesonSdkService } from './eyeson-sdk.service';

describe('EyesonSdkService', () => {
  let service: EyesonSdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EyesonSdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
