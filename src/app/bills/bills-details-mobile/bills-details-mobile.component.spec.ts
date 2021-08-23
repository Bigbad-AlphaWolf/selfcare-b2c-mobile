import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BillsDetailsMobileComponent } from './bills-details-mobile.component';
import { GetLabelLigneBillBordereauPipe } from 'src/shared/pipes/get-label-ligne-bill-bordereau.pipe';
import { FormatBillNumPipe } from 'src/shared/pipes/format-bill-num.pipe';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';
import { FormatBillDatePipe } from 'src/shared/pipes/format-bill-date.pipe';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material';
import { File } from '@ionic-native/file/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Overlay } from '@angular/cdk/overlay';

describe( 'BillsDetailsMobileComponent', () => {
	let component: BillsDetailsMobileComponent;
	let fixture: ComponentFixture<BillsDetailsMobileComponent>;

	beforeEach( waitForAsync( () => {
		TestBed.configureTestingModule( {
			declarations: [
				BillsDetailsMobileComponent,
				GetLabelLigneBillBordereauPipe,
				FormatBillNumPipe,
				FormatCurrencyPipe,
				FormatBillDatePipe,
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			imports: [MatDialogModule],
			providers: [
				{ provide: HttpClient, useValue: {} },
				{ provide: MatDialog },
				{ provide: Overlay },
				{
					provide: File,
					useValue: {},
				},
				{
					provide: InAppBrowser,
					useValue: {},
				},
			],
		} ).compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( BillsDetailsMobileComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
