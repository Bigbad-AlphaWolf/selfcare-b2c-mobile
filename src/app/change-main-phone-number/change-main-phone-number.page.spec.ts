import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChangeMainPhoneNumberPage } from './change-main-phone-number.page';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { of } from 'rxjs';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';

describe('ChangeMainPhoneNumberPage', () => {
	let component: ChangeMainPhoneNumberPage;
	let fixture: ComponentFixture<ChangeMainPhoneNumberPage>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ChangeMainPhoneNumberPage],
			providers: [
				{
					provide: AuthenticationService,
					useValue: {
						getSubscription: () => {
							return of();
						},
						getUserMainPhoneNumber: () => {}
					}
				},
				{
					provide: DashboardService,
					useValue: {
						getAttachedNumbers: () => {
							return of();
						},
						attachedNumbers: () => {
							return of();
						}
					}
				},
				{
					provide: Router
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ChangeMainPhoneNumberPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
