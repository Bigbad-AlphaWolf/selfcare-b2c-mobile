import { TestBed } from '@angular/core/testing';

import { FormulaireSatisfactionService } from './formulaire-satisfaction.service';

describe('FormulaireSatisfactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormulaireSatisfactionService = TestBed.get(FormulaireSatisfactionService);
    expect(service).toBeTruthy();
  });
});
