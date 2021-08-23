import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyCreditPage } from './buy-credit.page';
import { Router, UrlSerializer } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { of } from 'rxjs';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'BuyCreditPage', () => {
	let component: BuyCreditPage;
	let fixture: ComponentFixture<BuyCreditPage>;

	beforeEach( waitForAsync( () => {
		TestBed.configureTestingModule( {
			declarations: [BuyCreditPage],
			imports: [RouterTestingModule],
			providers: [
				{
					provide: Location
				},
				{
					provide: ModalController
				},
				{
					provide: HttpClient
				},
				{
					provide: HttpHandler
				},
				{
					provide: AngularDelegate
				},
				{
					provide: UrlSerializer
				},
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
							return of();
						}
					}
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		} ).compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( BuyCreditPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
