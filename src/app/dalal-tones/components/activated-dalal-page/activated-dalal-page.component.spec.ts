import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { ActivatedDalalPageComponent } from './activated-dalal-page.component';

describe( 'ActivatedDalalPageComponent', () => {
	let component: ActivatedDalalPageComponent;
	let fixture: ComponentFixture<ActivatedDalalPageComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			providers: [
				{
					provide: Location,
					useValue: {}
				},
				{
					provide: ModalController,
					useValue: {}
				},
				{
					provide: UrlSerializer,
					useValue: {}
				}
			],
			declarations: [ActivatedDalalPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( ActivatedDalalPageComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
