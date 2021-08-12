import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePassPage } from './liste-pass.page';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'ListePassPage', () => {
	let component: ListePassPage;
	let fixture: ComponentFixture<ListePassPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ListePassPage],
			imports: [RouterTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: ActivatedRoute },
				{ provide: Location },
				{ provide: UrlSerializer },
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
		fixture = TestBed.createComponent( ListePassPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
