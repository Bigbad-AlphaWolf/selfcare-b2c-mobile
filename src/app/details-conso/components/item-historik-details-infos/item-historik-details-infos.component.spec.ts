import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemHistorikDetailsInfosComponent } from './item-historik-details-infos.component';
import { FormatCalledNumberPipe } from 'src/shared/pipes/format-called-number.pipe';
import { FormatSecondDatePipe } from 'src/shared/pipes/format-second-date.pipe';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';

describe( 'ItemHistorikDetailsInfosComponent', () => {
	let component: ItemHistorikDetailsInfosComponent;
	let fixture: ComponentFixture<ItemHistorikDetailsInfosComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [
				ItemHistorikDetailsInfosComponent,
				FormatCalledNumberPipe,
				FormatSecondDatePipe,
				PhoneNumberDisplayPipe,
			],
			providers: [
				{
					provide: DashboardService,
					useValue: {
						getMainPhoneNumber: () => { }
					}
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} ).compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( ItemHistorikDetailsInfosComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
