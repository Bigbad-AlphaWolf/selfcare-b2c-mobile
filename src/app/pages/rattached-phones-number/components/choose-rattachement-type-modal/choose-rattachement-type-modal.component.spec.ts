import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { ChooseRattachementTypeModalComponent } from './choose-rattachement-type-modal.component';

describe( 'ChooseRattachementTypeModalComponent', () => {
	let component: ChooseRattachementTypeModalComponent;
	let fixture: ComponentFixture<ChooseRattachementTypeModalComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ChooseRattachementTypeModalComponent],
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
		fixture = TestBed.createComponent( ChooseRattachementTypeModalComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
