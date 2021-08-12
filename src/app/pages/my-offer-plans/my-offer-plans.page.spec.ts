import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOfferPlansPage } from './my-offer-plans.page';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OfferPlansService } from 'src/app/services/offer-plans-service/offer-plans.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { SargalService } from 'src/app/services/sargal-service/sargal.service';

describe( 'MyOfferPlansPage', () => {
	let component: MyOfferPlansPage;
	let fixture: ComponentFixture<MyOfferPlansPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [MyOfferPlansPage],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			imports: [RouterTestingModule],
			providers: [
				{ provide: Location, useValue: {} },
				{ provide: MatDialog },
				{
					provide: DashboardService,
					useValue: {
						getCurrentPhoneNumber: () => { }
					}
				},
				{
					provide: AuthenticationService,
					useValue: {
						getSubscription: () => {
							return of()
						}
					}
				},
				{
					provide: SargalService,
					useValue: {
						getSargalBalance: () => {
							return of()
						}
					}
				},
				{
					provide: OfferPlansService,
					useValue: {
						getCurrentUserOfferPlans: () => {
							return of()
						},
						orderBonPlanProduct: () => {
							return of()
						}
					}
				},

			],
		} ).compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( MyOfferPlansPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
