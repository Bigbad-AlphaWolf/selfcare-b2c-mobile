import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Network } from '@ionic-native/network/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { IonicModule, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';

import { OpenOmAccountPage } from './open-om-account.page';

describe( 'OpenOmAccountPage', () => {
	let component: OpenOmAccountPage;
	let fixture: ComponentFixture<OpenOmAccountPage>;

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
						initSelfOperationOtp: () => {
							return of()
						}
					}
				},
				{
					provide: ModalController,
					useValue: {}
				},
				{
					provide: AuthenticationService,
					useValue: {
						getMsisdnByNetwork: () => {
							return of()
						},
						confirmMsisdnByNetwork: () => {
							return of()
						}
					}
				},
				{
					provide: DashboardService,
					useValue: {
						attachedNumbers: () => {
							return of()
						},
						getCurrentPhoneNumber: () => {
							return ""
						},
						getMainPhoneNumber: () => {
							return ""
						}
					}
				},
				{
					provide: Network,
					useValue: {}
				},
				{
					provide: Uid,
					useValue: {}
				}
			],
			declarations: [OpenOmAccountPage, PhoneNumberDisplayPipe],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( OpenOmAccountPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
