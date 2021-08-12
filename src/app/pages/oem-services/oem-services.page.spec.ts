import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';

import { OemServicesPage } from './oem-services.page';

describe( 'OemServicesPage', () => {
	let component: OemServicesPage;
	let fixture: ComponentFixture<OemServicesPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [OemServicesPage],
			providers: [
				{
					provide: Location
				},
				{
					provide: UrlSerializer
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( OemServicesPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
