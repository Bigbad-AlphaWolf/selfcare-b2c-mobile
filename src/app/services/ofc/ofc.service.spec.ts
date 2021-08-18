import { TestBed } from '@angular/core/testing';
import { HTTP } from '@ionic-native/http/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { of } from 'rxjs';

import { OfcService } from './ofc.service';

describe( 'OfcService', () => {
	beforeEach( () => TestBed.configureTestingModule( {
		providers: [
			{
				provide: HTTP,
				useValue: {
					get: () => {
						return of()
					}
				}
			},
			{
				provide: InAppBrowser
			}
		]
	} ) );

	it( 'should be created', () => {
		const service: OfcService = TestBed.get( OfcService );
		expect( service ).toBeTruthy();
	} );
} );
