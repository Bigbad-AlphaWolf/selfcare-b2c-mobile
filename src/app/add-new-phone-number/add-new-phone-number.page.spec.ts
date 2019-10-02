import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPhoneNumberPage } from './add-new-phone-number.page';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { ReCaptchaV3Service } from 'ngx-captcha';

describe('AddNewPhoneNumberPage', () => {
	let component: AddNewPhoneNumberPage;
	let fixture: ComponentFixture<AddNewPhoneNumberPage>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [AddNewPhoneNumberPage],
			providers: [
				{
					provide: Router
				},
				{
					provide: DashboardService,
					useValue: {
						registerNumberToAttach: () => {},
						checkFixNumber: () => {},
						attachFixNumber: () => {}
					}
				},
				{
					provide: AuthenticationService,
					useValue: {
						getUserMainPhoneNumber: () => {},
						generateUserOtp: () => {},
						checkUserStatus: () => {},
						checkOtp: () => {}
					}
				},
				{
					provide: ReCaptchaV3Service,
					useValue: {
						execute: () => {}
					}
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AddNewPhoneNumberPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
