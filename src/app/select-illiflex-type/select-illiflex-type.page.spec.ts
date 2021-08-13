import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SelectIlliflexTypePage } from './select-illiflex-type.page';

describe( 'SelectIlliflexTypePage', () => {
	let component: SelectIlliflexTypePage;
	let fixture: ComponentFixture<SelectIlliflexTypePage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [SelectIlliflexTypePage],
			imports: [RouterTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( SelectIlliflexTypePage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
