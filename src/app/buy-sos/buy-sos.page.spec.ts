import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuySosPage } from './buy-sos.page';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { SosService } from '../services/sos-service/sos.service';
import { MatDialogModule, MatDialogRef } from '@angular/material';

describe('BuySosPage', () => {
	let component: BuySosPage;
	let fixture: ComponentFixture<BuySosPage>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BuySosPage],
			imports: [MatDialogModule],
			providers: [
				{
					provide: Router
				},
				{
					provide: DashboardService,
					useValue: {
						getCurrentPhoneNumber: () => {}
					}
				},
				{
					provide: SosService,
					useValue: {
						subscribeToSos: () => {}
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
		fixture = TestBed.createComponent(BuySosPage);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
