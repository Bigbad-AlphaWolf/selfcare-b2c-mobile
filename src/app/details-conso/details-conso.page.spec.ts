import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetailsConsoPage } from './details-conso.page';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe( 'DetailsConsoPage', () => {
	let component: DetailsConsoPage;
	let fixture: ComponentFixture<DetailsConsoPage>;

	beforeEach( waitForAsync( () => {
		TestBed.configureTestingModule( {
			declarations: [DetailsConsoPage],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [{ provide: HttpClient }, { provide: HttpHandler }],
		} ).compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( DetailsConsoPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
