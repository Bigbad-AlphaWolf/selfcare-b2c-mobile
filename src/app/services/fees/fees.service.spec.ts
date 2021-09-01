import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';

import { FeesService } from './fees.service';

describe( 'FeesService', () => {
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
			}
		]
	} ) );

	it( 'should be created', () => {
		const service: FeesService = TestBed.get( FeesService );
		expect( service ).toBeTruthy();
	} );
} );
