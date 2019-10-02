import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material';
import { SosService } from './sos.service';

describe('SosService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [SosService, { provide: HttpClient, useValue: {} }]
        });
    });

    it(
        'should be created',
        inject([SosService], (service: SosService) => {
            expect(service).toBeDefined();
        })
    );

    // it('should return an ordered sos category list based on attributes order', () => {
    //     const sosList = [];
    //     const orderedTypeSosList =
    // });
});
