import { inject, TestBed } from '@angular/core/testing';
import { FormuleService } from './formule.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { MatDialog } from '@angular/material';

describe('FormuleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient },
        { provide: MatDialog },
        { provide: HttpHandler, useValue: {} },
      ],
    });
  });

  it('should be created', inject(
    [FormuleService],
    (formule: FormuleService) => {
      expect(formule).toBeDefined();
    }
  ));
});
