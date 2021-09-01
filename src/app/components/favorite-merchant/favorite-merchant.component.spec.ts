import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { CodeFormatPipe } from 'src/app/pipes/code-format/code-format.pipe';
import { FavorisService } from 'src/app/services/favoris/favoris.service';
import { AcronymPipe } from 'src/shared/pipes/acronym.pipe';

import { FavoriteMerchantComponent } from './favorite-merchant.component';

describe( 'FavoriteMerchantComponent', () => {
	let component: FavoriteMerchantComponent;
	let fixture: ComponentFixture<FavoriteMerchantComponent>;

	beforeEach(
		waitForAsync( () => {
			TestBed.configureTestingModule( {
				providers: [
					{
						provide: FavorisService,
						useValue: {
							fetchFavorites: () => {
								return of();
							},
						},
					},
					{
						provide: ModalController,
					},
					{
						provide: AngularDelegate,
					},
				],
				declarations: [FavoriteMerchantComponent, AcronymPipe, CodeFormatPipe],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			} ).compileComponents();
		} )
	);

	beforeEach( () => {
		fixture = TestBed.createComponent( FavoriteMerchantComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
