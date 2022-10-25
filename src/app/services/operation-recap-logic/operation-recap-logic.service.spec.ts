import { TestBed } from '@angular/core/testing';

import { OperationRecapLogicService } from './operation-recap-logic.service';

describe('OperationRecapLogicService', () => {
  let service: OperationRecapLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationRecapLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
