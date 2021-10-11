import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { PassVoyageService } from './pass-voyage.service';

describe( 'PassVoyageService', () => {
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
		const service: PassVoyageService = TestBed.get( PassVoyageService );
		expect( service ).toBeTruthy();
	} );
} );
