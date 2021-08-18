import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { of } from 'rxjs';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { DashboardService } from '../dashboard-service/dashboard.service';

import { OperationService } from './operation.service';

describe( 'OperationService', () => {
	beforeEach( () => TestBed.configureTestingModule( {
		providers: [
			{
				provide: HttpClient,
				useValue: {
					get: () => {
						return of()
					},
					post: () => {
						return of()
					}
				}
			},
			{
				provide: AppVersion,
				useValue: {
					getVersionNumber: () => {
						return of().toPromise()
					}
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
				provide: DashboardService,
				useValue: {
					getCurrentPhoneNumber: () => {
						return ""
					}
				}
			}
		]
	} ) );

	it( 'should be created', () => {
		const service: OperationService = TestBed.get( OperationService );
		expect( service ).toBeTruthy();
	} );
} );
