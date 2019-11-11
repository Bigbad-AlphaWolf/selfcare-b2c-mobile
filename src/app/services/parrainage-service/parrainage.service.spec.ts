import { TestBed } from '@angular/core/testing';

import { ParrainageService } from './parrainage.service';
import { HttpClient } from '@angular/common/http';

describe('ParrainageService', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [{ provide: HttpClient, useValue: {} }]
        })
    );

    it('should be created', () => {
        const service: ParrainageService = TestBed.get(ParrainageService);
        expect(service).toBeTruthy();
    });
});
