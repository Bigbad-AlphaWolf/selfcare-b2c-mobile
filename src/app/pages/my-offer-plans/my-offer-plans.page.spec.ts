import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOfferPlansPage } from './my-offer-plans.page';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'MyOfferPlansPage', () => {
	let component: MyOfferPlansPage;
	let fixture: ComponentFixture<MyOfferPlansPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [MyOfferPlansPage],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			imports: [RouterTestingModule],
			providers: [
				{ provide: Location, useValue: {} },
				{
					provide: HttpClient,
					useValue: {
						post: () => {
							return of();
						},
						get: () => {
							return of();
						},
					},
				},
			],
		} ).compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( MyOfferPlansPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
