import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SargalRegistrationPage } from './sargal-registration.page';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { SargalService } from 'src/app/services/sargal-service/sargal.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

describe( 'SargalRegistrationPage', () => {
	let component: SargalRegistrationPage;
	let fixture: ComponentFixture<SargalRegistrationPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [SargalRegistrationPage],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			imports: [RouterTestingModule],
			providers: [
				{ provide: MatDialog },
				{ provide: MatDialogRef },
				{
					provide: SargalService,
					useValue: {
						registerToSargal: () => {
							return of()
						}
					}
				},
				{
					provide: DashboardService,
					useValue: {
						getCurrentPhoneNumber: () => {
							return ""
						}
					}
				},
				{
					provide: FollowAnalyticsService,
					useValue: {
						registerEventFollow: () => {
							return ""
						}
					}
				}
			],
		} ).compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( SargalRegistrationPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
