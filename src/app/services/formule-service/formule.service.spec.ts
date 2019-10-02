import { inject, TestBed } from '@angular/core/testing';
import { FormuleService } from './formule.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';

describe('FormuleService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: HttpClient }, { provide: MatDialog }]
        });
    });

    it(
        'should be created',
        inject([FormuleService], (formule: FormuleService) => {
            expect(formule).toBeDefined();
        })
    );
});
