import { TestBed } from '@angular/core/testing';

import { PassIllimixService } from './pass-illimix.service';
import { HttpClient } from '@angular/common/http';

describe('PassIllimixService', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [{ provide: HttpClient }]
        })
    );

    it('should be created', () => {
        const service: PassIllimixService = TestBed.get(PassIllimixService);
        expect(service).toBeTruthy();
    });
});
