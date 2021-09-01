import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyPassIllimixPage } from './buy-pass-illimix.page';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { of } from 'rxjs';
import { MatDialogRef, MatDialogModule } from '@angular/material';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'BuyPassIllimixPage', () => {
	let component: BuyPassIllimixPage;
	let fixture: ComponentFixture<BuyPassIllimixPage>;

	beforeEach( waitForAsync( () => {
		TestBed.configureTestingModule( {
			declarations: [BuyPassIllimixPage],
			imports: [MatDialogModule, RouterTestingModule],
			providers: [
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
					provide: DashboardService,
					useValue: {
						buyPassByCredit: () => { },
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
				},
				{
					provide: MatDialogRef,
					useValue: {}
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		} ).compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( BuyPassIllimixPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
