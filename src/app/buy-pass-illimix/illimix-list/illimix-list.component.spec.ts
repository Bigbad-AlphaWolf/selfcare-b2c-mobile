import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IllimixListComponent } from './illimix-list.component';
import { PassIllimixService } from 'src/app/services/pass-illimix-service/pass-illimix.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('IllimixListComponent', () => {
	let component: IllimixListComponent;
	let fixture: ComponentFixture<IllimixListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [IllimixListComponent],
			providers: [
				{
					provide: PassIllimixService,
					useValue: {
						setPhoneNumber: () => {},
						setPaymentMod: () => {},
						setListPassIllimix: () => {},
						getStatusLoadingPass: () => {
							return of();
						},
						getListPassIllimix: () => {},
						getListPassIllimixShown: () => {},
						getCategoryListPassIllimix: () => {}
					}
				},
				{
					provide: DashboardService,
					useValue: {
						getCurrentPhoneNumber: () => {}
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
		fixture = TestBed.createComponent(IllimixListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
