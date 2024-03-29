import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularDelegate, ModalController } from '@ionic/angular';

import { CardRapidoNameModalComponent } from './card-rapido-name-modal.component';

describe( 'CardRapidoNameModalComponent', () => {
	let component: CardRapidoNameModalComponent;
	let fixture: ComponentFixture<CardRapidoNameModalComponent>;

	beforeEach(
		waitForAsync( () => {
			TestBed.configureTestingModule( {
				imports: [ReactiveFormsModule, FormsModule],
				providers: [
					{
						provide: ModalController,
					},
					{
						provide: AngularDelegate,
					},
				],
				declarations: [CardRapidoNameModalComponent],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			} ).compileComponents();
		} )
	);

	beforeEach( () => {
		fixture = TestBed.createComponent( CardRapidoNameModalComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
