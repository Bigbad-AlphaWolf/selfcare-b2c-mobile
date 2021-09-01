import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { DashboardService } from '../dashboard-service/dashboard.service';

import { CommunityService } from './community.service';

describe( 'CommunityService', () => {
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
		const service: CommunityService = TestBed.get( CommunityService );
		expect( service ).toBeTruthy();
	} );
} );
