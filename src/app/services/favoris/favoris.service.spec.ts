import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';

import { FavorisService } from './favoris.service';

describe( 'FavorisService', () => {
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
				provide: OrangeMoneyService,
				useValue: {
					getOmMsisdn: () => {
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
		const service: FavorisService = TestBed.get( FavorisService );
		expect( service ).toBeTruthy();
	} );
} );
