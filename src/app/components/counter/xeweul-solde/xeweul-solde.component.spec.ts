import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularDelegate, ModalController, NavController} from '@ionic/angular';
import {of} from 'rxjs';
import {XeweulService} from 'src/app/services/xeweul/xeweul.service';

import {XeweulSoldeComponent} from './xeweul-solde.component';

describe('XeweulSoldeComponent', () => {
    let component: XeweulSoldeComponent;
    let fixture: ComponentFixture<XeweulSoldeComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [RouterTestingModule],
                providers: [
                    {
                        provide: XeweulService,
                        useValue: {
                            getSolde: () => {
                                return of();
                            },
                        },
                    },
                    {
                        provide: NavController,
                    },
                    {
                        provide: ModalController,
                    },
                    {
                        provide: AngularDelegate,
                    },
                ],
                declarations: [XeweulSoldeComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            }).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(XeweulSoldeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
