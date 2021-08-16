import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { RequestOemService } from './request-oem.service';

describe( 'RequestOemService', () => {
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
			}
		]
	} ) );

	it( 'should be created', () => {
		const service: RequestOemService = TestBed.get( RequestOemService );
		expect( service ).toBeTruthy();
	} );
} );
