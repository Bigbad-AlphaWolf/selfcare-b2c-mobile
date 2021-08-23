import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Router } from '@angular/router';
import { PassInternetService } from 'src/app/services/pass-internet-service/pass-internet.service';
import { of } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { ListPassInternetV2Component } from './list-pass-internet-v2.component';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'ListPassInternetV2Component', () => {
	let component: ListPassInternetV2Component;
	let fixture: ComponentFixture<ListPassInternetV2Component>;

	beforeEach( waitForAsync( () => {
		TestBed.configureTestingModule( {
			declarations: [ListPassInternetV2Component],
			imports: [RouterTestingModule],
			providers: [
				{
					provide: PassInternetService,
					useValue: {
						setUserPhoneNumber: () => { },
						setPaymentMod: () => { },
						queryListPassInternetOfUser: () => {
							return of()
						},
						getStatusPassLoaded: () => {
							return of();
						},
						setUserCodeFormule: () => { },
						getListCategoryPassInternet: () => { },
						getListPassInternetOfUser: () => { },
						getListPassInternetShown: () => { }
					}
				},
				{
					provide: DashboardService,
					useValue: {
						getCurrentPhoneNumber: () => { }
					}
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		} ).compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( ListPassInternetV2Component );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
