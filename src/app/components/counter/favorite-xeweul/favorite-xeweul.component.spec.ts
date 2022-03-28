import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { CodeFormatPipe } from 'src/app/pipes/code-format/code-format.pipe';

import { FavoriteXeweulComponent } from './favorite-xeweul.component';

describe( 'FavoriteXeweulComponent', () => {
	let component: FavoriteXeweulComponent;
	let fixture: ComponentFixture<FavoriteXeweulComponent>;

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
				declarations: [FavoriteXeweulComponent, CodeFormatPipe],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			} ).compileComponents();
		} )
	);

	beforeEach( () => {
		fixture = TestBed.createComponent( FavoriteXeweulComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
