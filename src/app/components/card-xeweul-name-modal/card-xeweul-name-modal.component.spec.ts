import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularDelegate, ModalController} from '@ionic/angular';

import {CardXeweulNameModalComponent} from './card-xeweul-name-modal.component';

describe('CardXeweulNameModalComponent', () => {
    let component: CardXeweulNameModalComponent;
    let fixture: ComponentFixture<CardXeweulNameModalComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [ReactiveFormsModule, FormsModule],
                providers: [
                    {
                        provide: ModalController,
                    },
                    {
                        provide: AngularDelegate,
                    },
                ],
                declarations: [CardXeweulNameModalComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(CardXeweulNameModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
