import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { FollowAnalyticsService } from '../follow-analytics/follow-analytics.service';

import { IlliflexService } from './illiflex.service';

describe( 'IlliflexService', () => {
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
		]
	} ) );

	it( 'should be created', () => {
		const service: IlliflexService = TestBed.get( IlliflexService );
		expect( service ).toBeTruthy();
	} );
} );
