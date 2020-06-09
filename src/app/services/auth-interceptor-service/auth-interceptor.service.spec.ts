import { TestBed, inject } from '@angular/core/testing';

import { AuthInterceptorService } from './auth-interceptor.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { of } from 'rxjs';

describe('AuthInterceptorService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthInterceptorService,
				{ provide: Router, useValue: {} },
				{ provide: HttpClient, useValue: {} },
				{ provide: AppVersion, useValue: {
					getVersionNumber:() => {
						 return new Promise(()=> {} );
					}
				} }
			]
		});
	});

	it('should be created', inject(
		[AuthInterceptorService],
		(service: AuthInterceptorService) => {
			expect(service).toBeDefined();
		}
	));
});
