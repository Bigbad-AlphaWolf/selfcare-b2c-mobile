import { TestBed } from '@angular/core/testing';

import { FileOemService } from './file-oem.service';

describe('FileOemService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileOemService = TestBed.get(FileOemService);
    expect(service).toBeTruthy();
  });
});
