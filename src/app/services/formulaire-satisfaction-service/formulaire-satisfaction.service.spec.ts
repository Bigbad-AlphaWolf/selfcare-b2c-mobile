import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { FormulaireSatisfactionService } from './formulaire-satisfaction.service';

describe( 'FormulaireSatisfactionService', () => {
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
		const service: FormulaireSatisfactionService = TestBed.get( FormulaireSatisfactionService );
		expect( service ).toBeTruthy();
	} );
} );
