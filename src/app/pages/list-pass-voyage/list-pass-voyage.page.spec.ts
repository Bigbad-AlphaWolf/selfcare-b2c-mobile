import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PassInternetService } from 'src/app/services/pass-internet-service/pass-internet.service';
import { PassVoyageService } from 'src/app/services/pass-voyage/pass-voyage.service';

import { ListPassVoyagePage } from './list-pass-voyage.page';

describe( 'ListPassVoyagePage', () => {
	let component: ListPassVoyagePage;
	let fixture: ComponentFixture<ListPassVoyagePage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ListPassVoyagePage],
			imports: [RouterTestingModule],
			providers: [
				{
					provide: PassVoyageService,
					useValue: {
						fetchCountries: () => {
							return of()
						},
						fetchPassVoyage: () => {
							return of()
						}
					}
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( ListPassVoyagePage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
