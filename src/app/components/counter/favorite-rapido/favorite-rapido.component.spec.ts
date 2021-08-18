import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { CodeFormatPipe } from 'src/app/pipes/code-format/code-format.pipe';

import { FavoriteRapidoComponent } from './favorite-rapido.component';

describe( 'FavoriteRapidoComponent', () => {
	let component: FavoriteRapidoComponent;
	let fixture: ComponentFixture<FavoriteRapidoComponent>;

	beforeEach(
		waitForAsync( () => {
			TestBed.configureTestingModule( {
				providers: [
					{
						provide: ModalController,
					},
					{
						provide: AngularDelegate,
					},
				],
				declarations: [FavoriteRapidoComponent, CodeFormatPipe],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			} ).compileComponents();
		} )
	);

	beforeEach( () => {
		fixture = TestBed.createComponent( FavoriteRapidoComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
