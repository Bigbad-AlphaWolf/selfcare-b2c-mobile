import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { of } from 'rxjs';
import { FeesService } from 'src/app/services/fees/fees.service';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';

import { BillAmountPage } from './bill-amount.page';

describe( 'BillAmountPage', () => {
	let component: BillAmountPage;
	let fixture: ComponentFixture<BillAmountPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [BillAmountPage, FormatCurrencyPipe],
			providers: [
				{
					provide: Location
				},
				{
					provide: UrlSerializer
				},
				{
					provide: FeesService,
					useValue: {
						getFeesByOMService: () => {
							return of()
						},
						extractFees: () => {
							return ""
						}
					}
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( BillAmountPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
