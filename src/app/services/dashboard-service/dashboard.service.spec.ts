import { TestBed, inject } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { of } from 'rxjs';
import { BoosterService } from '../booster.service';

describe( 'DashboardService', () => {
	beforeEach( () => {
		TestBed.configureTestingModule( {
			providers: [DashboardService,
				{ provide: HttpClient },
				{
					provide: ModalController
				},
				{
					provide: AuthenticationService,
					useValue: {
						currentPhoneNumberSetSubject: of(),
						getLocalUserInfos: () => {
							return {}
						},
						getUserMainPhoneNumber: () => {
							return ""
						}
					}
				},
				{
					provide: BoosterService,
					useValue: {
						getBoosters: () => {
							return of()
						}
					}
				}
			]
		} );
	} );

	it(
		'should be created',
		inject( [DashboardService], ( service: DashboardService ) => {
			expect( service ).toBeDefined();
		} )
	);
} );
