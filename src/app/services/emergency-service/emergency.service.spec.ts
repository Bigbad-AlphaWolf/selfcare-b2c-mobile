import { TestBed, inject } from '@angular/core/testing';

import { EmergencyService } from './emergency.service';
import { HttpClient } from '@angular/common/http';

describe('EmergencyService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [EmergencyService, { provide: HttpClient, useValue: {} }]
        });
    });

    it(
        'should be created',
        inject([EmergencyService], (service: EmergencyService) => {
            expect(service).toBeDefined();
        })
    );
});
