import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { BillsService } from 'src/app/services/bill-service/bills.service';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';

import { OrangeBillsPage } from './orange-bills.page';

describe( 'OrangeBillsPage', () => {
	let component: OrangeBillsPage;
	let fixture: ComponentFixture<OrangeBillsPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [OrangeBillsPage, PhoneNumberDisplayPipe],
			imports: [RouterTestingModule],
			providers: [
				{
					provide: BillsService,
					useValue: {
						moisDisponible: () => {
							return of()
						},
						bordereau: () => {
							return of()
						},
						invoices: () => {
							return of()
						},
						mailToCustomerService: () => {
							return ""
						}
					}
				},
				{
					provide: ModalController
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( OrangeBillsPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
