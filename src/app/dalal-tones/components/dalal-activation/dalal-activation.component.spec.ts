import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { DalalActivationComponent } from './dalal-activation.component';

describe( 'DalalActivationComponent', () => {
	let component: DalalActivationComponent;
	let fixture: ComponentFixture<DalalActivationComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			providers: [
				{
					provide: ModalController,
					useValue: {}
				},
				{
					provide: HttpClient,
					useValue: {}
				}
			],
			declarations: [DalalActivationComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( DalalActivationComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
