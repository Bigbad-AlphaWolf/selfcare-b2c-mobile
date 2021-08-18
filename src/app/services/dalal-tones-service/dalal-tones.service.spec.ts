import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { FollowAnalyticsService } from '../follow-analytics/follow-analytics.service';

import { DalalTonesService } from './dalal-tones.service';

describe( 'DalalTonesService', () => {
	beforeEach( () => TestBed.configureTestingModule( {
		providers: [
			{
				provide: HttpClient,
				useValue: {
					get: () => {
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
		const service: DalalTonesService = TestBed.get( DalalTonesService );
		expect( service ).toBeTruthy();
	} );
} );
