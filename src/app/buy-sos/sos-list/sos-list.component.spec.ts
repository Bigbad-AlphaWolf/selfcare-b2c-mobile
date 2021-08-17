import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SosListComponent } from './sos-list.component';
import { SosService } from 'src/app/services/sos-service/sos.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { of } from 'rxjs';

describe('SosListComponent', () => {
	let component: SosListComponent;
	let fixture: ComponentFixture<SosListComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [SosListComponent],
			providers: [
				{
					provide: SosService,
					useValue: {
						getListSosByFormule: () => {
							return of()
						}
					}
				},
				{
					provide: DashboardService,
					useValue: {
						getCurrentPhoneNumber: () => {}
					}
				},
				{
					provide: AuthenticationService,
					useValue: {
						getSubscription: () => {
							return of();
						}
					}
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SosListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
