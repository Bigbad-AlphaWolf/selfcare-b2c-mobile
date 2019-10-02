import { TestBed } from '@angular/core/testing';

import { BanniereService } from './banniere.service';
import { HttpClient } from '@angular/common/http';

describe('BanniereService', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [{ provide: HttpClient }]
        })
    );

    it('should be created', () => {
        const service: BanniereService = TestBed.get(BanniereService);
        expect(service).toBeTruthy();
    });
});
