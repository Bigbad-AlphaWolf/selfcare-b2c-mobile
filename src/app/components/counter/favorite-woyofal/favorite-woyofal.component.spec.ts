import { Overlay } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheet } from '@angular/material';
import { UrlSerializer } from '@angular/router';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { CodeFormatPipe } from 'src/app/pipes/code-format/code-format.pipe';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { FavorisService } from 'src/app/services/favoris/favoris.service';

import { FavoriteWoyofalComponent } from './favorite-woyofal.component';

describe( 'FavoriteWoyofalComponent', () => {
	let component: FavoriteWoyofalComponent;
	let fixture: ComponentFixture<FavoriteWoyofalComponent>;

	beforeEach(
		waitForAsync( () => {
			TestBed.configureTestingModule( {
				providers: [
					{
						provide: BottomSheetService,
						useValue: {}
					},
					{
						provide: MatBottomSheet,
					},
					{
						provide: ModalController,
					},
					{
						provide: Overlay,
					},
					{
						provide: AngularDelegate,
					},
					{
						provide: UrlSerializer,
					},
					{
						provide: FavorisService,
						useValue: {
							fetchFavorites: () => {
								return of();
							},
						},
					},
				],
				declarations: [FavoriteWoyofalComponent, CodeFormatPipe],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			} ).compileComponents();
		} )
	);

	beforeEach( () => {
		fixture = TestBed.createComponent( FavoriteWoyofalComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
