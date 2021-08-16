import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { YesNoModalComponent } from './yes-no-modal.component';

describe( 'YesNoModalComponent', () => {
	let component: YesNoModalComponent;
	let fixture: ComponentFixture<YesNoModalComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [YesNoModalComponent],
			providers: [
				{
					provide: ModalController
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( YesNoModalComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
