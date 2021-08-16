import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetOperationAmountComponent } from './set-operation-amount.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { of } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'SetOperationAmountComponent', () => {
	let component: SetOperationAmountComponent;
	let fixture: ComponentFixture<SetOperationAmountComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			imports: [FormsModule, RouterTestingModule],
			declarations: [SetOperationAmountComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: OrangeMoneyService, useValue: {
						getOmMsisdn: () => {
							return of()
						},
						checkBalanceSufficiency: () => {
							return of()
						}
					}
				},
				{
					provide: ModalController
				}
			]
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( SetOperationAmountComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
