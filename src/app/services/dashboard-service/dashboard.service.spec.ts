import { TestBed, inject } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { HttpClient } from '@angular/common/http';

describe('DashboardService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DashboardService, { provide: HttpClient }]
        });
    });

    it(
        'should be created',
        inject([DashboardService], (service: DashboardService) => {
            expect(service).toBeDefined();
        })
    );
});
