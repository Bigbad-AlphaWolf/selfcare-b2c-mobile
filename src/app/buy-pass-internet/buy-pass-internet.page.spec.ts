import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuyPassInternetPage } from './buy-pass-internet.page';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { of } from 'rxjs';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'BuyPassInternetPage', () => {
	let component: BuyPassInternetPage;
	let fixture: ComponentFixture<BuyPassInternetPage>;

	beforeEach(
		waitForAsync( () => {
			TestBed.configureTestingModule( {
				declarations: [BuyPassInternetPage],
				imports: [MatDialogModule, RouterTestingModule],
				providers: [
					{
						provide: ModalController
					},
					{
						provide: DashboardService,
						useValue: {
							getCurrentPhoneNumber: () => { },
							buyPassByCredit: () => { },
							buyPassByCreditForSomeone: () => { }
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
					},
					{
						provide: ActivatedRoute,
						useValue: {}
					},
					{
						provide: HttpClient,
						useValue: {}
					}
				],
				schemas: [CUSTOM_ELEMENTS_SCHEMA]
			} ).compileComponents();
		} )
	);

	beforeEach( () => {
		fixture = TestBed.createComponent( BuyPassInternetPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
