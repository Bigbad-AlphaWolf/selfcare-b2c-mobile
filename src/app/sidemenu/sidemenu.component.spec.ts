import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidemenuComponent } from './sidemenu.component';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { of } from 'rxjs';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { MatDialog } from '@angular/material';
import { AccountService } from '../services/account-service/account.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';

describe( 'SidemenuComponent', () => {
	let component: SidemenuComponent;
	let fixture: ComponentFixture<SidemenuComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [SidemenuComponent, PhoneNumberDisplayPipe],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: Router
				},
				{
					provide: MatDialog
				},
				{
					provide: InAppBrowser
				},
				{
					provide: AccountService,
					useValue: {
						launchInProgressPage: () => { },
						userUrlAvatarSubject: of()
					}
				},
				{
					provide: AuthenticationService,
					useValue: {
						getToken: () => {
							return ""
						},
						getSubscription: () => {
							return of()
						},
						currentPhoneNumbersubscriptionUpdated: of()
					}
				},
				{
					provide: DashboardService,
					useValue: {
						currentPhoneNumberChange: of(),
						getCurrentPhoneNumber: () => {
							return ""
						}
					}
				}
			]
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( SidemenuComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
