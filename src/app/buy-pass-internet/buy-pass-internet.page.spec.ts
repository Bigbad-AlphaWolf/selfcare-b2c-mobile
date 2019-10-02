import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyPassInternetPage } from './buy-pass-internet.page';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { of } from 'rxjs';
import { MatDialogModule, MatDialogRef } from '@angular/material';

describe('BuyPassInternetPage', () => {
	let component: BuyPassInternetPage;
	let fixture: ComponentFixture<BuyPassInternetPage>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BuyPassInternetPage],
			imports: [MatDialogModule],
			providers: [
				{
					provide: Router
				},
				{
					provide: DashboardService,
					useValue: {
						getCurrentPhoneNumber: () => {},
						buyPassByCredit: () => {},
						buyPassByCreditForSomeone: () => {}
					}
				},
				{
					provide: AuthenticationService,
					useValue: {
						getSubscription: () => {
							return of();
						}
					}
				},
				{
					provide: MatDialogRef
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BuyPassInternetPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
