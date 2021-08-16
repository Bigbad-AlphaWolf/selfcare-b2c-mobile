import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';

import { RecentsService } from './recents.service';

describe( 'RecentsService', () => {
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
		const service: RecentsService = TestBed.get( RecentsService );
		expect( service ).toBeTruthy();
	} );
} );
