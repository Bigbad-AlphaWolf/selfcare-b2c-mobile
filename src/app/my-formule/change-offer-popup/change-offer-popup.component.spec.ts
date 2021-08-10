import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';

import { ChangeOfferPopupComponent } from './change-offer-popup.component';

describe( 'ChangeOfferPopupComponent', () => {
	let component: ChangeOfferPopupComponent;
	let fixture: ComponentFixture<ChangeOfferPopupComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ChangeOfferPopupComponent],
			providers: [
				{
					provide: MatDialog,
					useValue: {}
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( ChangeOfferPopupComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
