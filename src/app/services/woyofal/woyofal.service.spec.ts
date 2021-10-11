import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { WoyofalService } from './woyofal.service';

describe( 'WoyofalService', () => {
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
		const service: WoyofalService = TestBed.get( WoyofalService );
		expect( service ).toBeTruthy();
	} );
} );
