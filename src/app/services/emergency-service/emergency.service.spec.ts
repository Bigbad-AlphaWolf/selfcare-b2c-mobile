import { TestBed, inject } from '@angular/core/testing';

import { EmergencyService } from './emergency.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe( 'EmergencyService', () => {
	beforeEach( () => {
		TestBed.configureTestingModule( {
			providers: [EmergencyService, { provide: HttpClient, useValue: {} },
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
				}]
		} );
	} );

	it(
		'should be created',
		inject( [EmergencyService], ( service: EmergencyService ) => {
			expect( service ).toBeDefined();
		} )
	);
} );
