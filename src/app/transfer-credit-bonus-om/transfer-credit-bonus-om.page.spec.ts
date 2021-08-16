import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCreditBonusOmPage } from './transfer-credit-bonus-om.page';
import { Router, ActivatedRoute, UrlSerializer } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { of } from 'rxjs';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController } from '@ionic/angular';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';

describe( 'TransferCreditBonusOmPage', () => {
	let component: TransferCreditBonusOmPage;
	let fixture: ComponentFixture<TransferCreditBonusOmPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [TransferCreditBonusOmPage],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			imports: [RouterTestingModule],
			providers: [
				{
					provide: UrlSerializer
				},
				{
					provide: ModalController
				},
				{
					provide: ActivatedRoute
				},
				{
					provide: Location
				},
				{
					provide: OrangeMoneyService,
					useValue: {
						getOrangeMoneyNumber: () => {
							return of()
						}
					}
				},
				{
					provide: DashboardService,
					useValue: {
						getCurrentPhoneNumber: () => {
							return ""
						},
						transferBonus: () => {
							return of()
						},
						transferCredit: () => {
							return of()
						},
						getUserConsoInfosByCode: () => {
							return of()
						}
					}
				},
				{
					provide: AuthenticationService,
					useValue: {
						isPostpaid: () => {
							return of()
						},
						getSubscription: () => {
							return of()
						}
					}
				}
			]
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( TransferCreditBonusOmPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
