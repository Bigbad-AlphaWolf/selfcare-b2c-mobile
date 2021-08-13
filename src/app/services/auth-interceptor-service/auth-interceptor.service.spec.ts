import { TestBed, inject } from '@angular/core/testing';

import { AuthInterceptorService } from './auth-interceptor.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { of } from 'rxjs';
import { ModalController } from '@ionic/angular';

describe( 'AuthInterceptorService', () => {
	beforeEach( () => {
		TestBed.configureTestingModule( {
			providers: [
				AuthInterceptorService,
				{ provide: Router, useValue: {} },
				{ provide: ModalController },
				{ provide: HttpClient, useValue: {} },
				{
					provide: AppVersion, useValue: {
						getVersionNumber: () => {
							return new Promise( () => { } );
						}
					}
				}
			]
		} );
	} );

	it( 'should be created', inject(
		[AuthInterceptorService],
		( service: AuthInterceptorService ) => {
			expect( service ).toBeDefined();
		}
	) );
} );
