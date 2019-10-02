import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPassInternetComponent } from './list-pass-internet.component';
import { Router } from '@angular/router';
import { PassInternetService } from 'src/app/services/pass-internet-service/pass-internet.service';
import { of } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';

describe('ListPassInternetComponent', () => {
	let component: ListPassInternetComponent;
	let fixture: ComponentFixture<ListPassInternetComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ListPassInternetComponent],
			providers: [
				{
					provide: Router
				},
				{
					provide: PassInternetService,
					useValue: {
						setUserPhoneNumber: () => {},
						setPaymentMod: () => {},
						setListPassInternetOfUserByQuery: () => {},
						getStatusPassLoaded: () => {
							return of();
						},
						getListCategoryPassInternet: () => {},
						getListPassInternetOfUser: () => {},
						getListPassInternetShown: () => {}
					}
				},
				{
					provide: DashboardService,
					useValue: {
						getCurrentPhoneNumber: () => {}
					}
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ListPassInternetComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
