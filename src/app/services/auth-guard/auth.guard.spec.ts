import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../dashboard-service/dashboard.service';
describe('AuthGuard', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthGuard,
				{ provide: Router, useValue: {} },
				{ provide: HttpClient, useValue: {} },
				{
					provide: DashboardService,
					useValue: {
						getUserConsoInfosByCode: () => {
							return { subscribe: () => {} };
						}
					}
				}
			]
		});
	});

	it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
		expect(guard).toBeDefined();
	}));
});
