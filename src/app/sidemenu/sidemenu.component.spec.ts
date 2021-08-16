import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidemenuComponent } from './sidemenu.component';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { of } from 'rxjs';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { AccountService } from '../services/account-service/account.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { BottomSheetService } from '../services/bottom-sheet/bottom-sheet.service';

describe( 'SidemenuComponent', () => {
	let component: SidemenuComponent;
	let fixture: ComponentFixture<SidemenuComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			imports: [RouterTestingModule],
			declarations: [SidemenuComponent, PhoneNumberDisplayPipe],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{
					provide: MatDialog
				},
				{
					provide: InAppBrowser
				},
				{
					provide: Location
				},
				{
					provide: MatBottomSheet
				},
				{
					provide: AppVersion
				},
				{
					provide: SocialSharing
				},
				{
					provide: AccountService,
					useValue: {
						launchInProgressPage: () => { },
						userUrlAvatarSubject: of(),
						deletedPhoneNumbersEmit: () => {
							return of()
						}
					}
				},
				{
					provide: BottomSheetService,
					useValue: {
						openRattacheNumberModal: () => { }
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
						},
						attachedNumbersChanged: of(),
						getMainPhoneNumber: () => {
						},
						setCurrentPhoneNumber: () => {
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
