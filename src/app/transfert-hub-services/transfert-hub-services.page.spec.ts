import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertHubServicesPage } from './transfert-hub-services.page';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Contacts } from '@ionic-native/contacts';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { OfferPlansService } from '../services/offer-plans-service/offer-plans.service';
import { of } from 'rxjs';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { MatBottomSheet } from '@angular/material';

describe( 'TransfertHubServicesPage', () => {
	let component: TransfertHubServicesPage;
	let fixture: ComponentFixture<TransfertHubServicesPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [TransfertHubServicesPage],
			imports: [RouterTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: ModalController
				},
				{
					provide: Location
				},
				{
					provide: MatBottomSheet
				},
				{
					provide: OfferPlansService,
					useValue: {
						getUserTypeOfferPlans: () => {
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
						getActivePromoBooster: () => {
							return of()
						}
					}
				},
				{
					provide: ModalController
				},
				{
					provide: Contacts
				}
			]
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( TransfertHubServicesPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
