import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';

import { NewDeplafonnementOmPage } from './new-deplafonnement-om.page';

describe( 'NewDeplafonnementOmPage', () => {
	let component: NewDeplafonnementOmPage;
	let fixture: ComponentFixture<NewDeplafonnementOmPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
			providers: [
				{
					provide: OrangeMoneyService,
					useValue: {
						getUserStatus: () => {
							return of()
						},
						getOmMsisdn: () => {
							return of()
						},
						initSelfOperationOtp: () => {
							return of()
						}
					}
				},
				{
					provide: DashboardService,
					useValue: {
						getCustomerInformations: () => {
							return of()
						},
						getCurrentPhoneNumber: () => {
							return ""
						}
					}
				},
				{
					provide: ModalController,
					useValue: {}
				}
			],
			declarations: [NewDeplafonnementOmPage, PhoneNumberDisplayPipe],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( NewDeplafonnementOmPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
