import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AvantagePopupComponent } from './avantage-popup.component';

describe('AvantagePopupComponent', () => {
    let component: AvantagePopupComponent;
    let fixture: ComponentFixture<AvantagePopupComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AvantagePopupComponent]
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AvantagePopupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
