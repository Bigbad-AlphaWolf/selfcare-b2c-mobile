import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { PassInternetService } from '../services/pass-internet-service/pass-internet.service';

import { ListPassUsagePage } from './list-pass-usage.page';

describe( 'ListPassUsagePage', () => {
	let component: ListPassUsagePage;
	let fixture: ComponentFixture<ListPassUsagePage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			imports: [RouterTestingModule],
			providers: [
				{
					provide: PassInternetService,
					useValue: {
						getPassUsage: () => {
							return of()
						}
					}
				}
			],
			declarations: [ListPassUsagePage],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( ListPassUsagePage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
