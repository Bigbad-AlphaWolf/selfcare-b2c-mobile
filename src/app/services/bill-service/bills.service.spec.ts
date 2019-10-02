import { TestBed, inject } from '@angular/core/testing';
import { BillsService } from './bills.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	MatButtonModule,
	MatInputModule,
	MatCheckboxModule,
	MatDialogModule,
	MatIconModule,
	MatFormFieldModule,
	MatDialogRef
} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { observable, of } from 'rxjs';
import { DashboardService } from '../dashboard-service/dashboard.service';

describe('BillsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			schemas: [NO_ERRORS_SCHEMA],
			imports: [
				BrowserAnimationsModule,
				MatButtonModule,
				MatInputModule,
				MatCheckboxModule,
				MatDialogModule,
				MatIconModule,
				MatFormFieldModule
			],
			providers: [
				{ provide: Router, useValue: {} },
				{ provide: ActivatedRoute, useValue: {} },
				{
					provide: HttpClient,
					useValue: {
						get: () => {
							return {
								subscribe: () => {
									const bills = [
										{
											numeroTelephone: '776440968',
											numeroFacture: '776440968P1904003067',
											dateFacture: '2019-05-06',
											numeroClient: 'A0000071639',
											compteClient: 'B0000365408',
											mois: 4,
											annee: 19,
											dateEcheance: '2019-05-27',
											montantFacture: 21000,
											montantTVA: 3194,
											statutFacture: 'NON PAYEE'
										}
									];
									return of(bills);
								}
							};
						}
					}
				},
				FormBuilder,
				{ provide: Validators, useValue: {} },
				{ provide: FormGroup, useValue: {} },
				{ provide: MatDialogRef, useValue: {} },
				{
					provide: DashboardService,
					useValue: {
						getBills: () => {
							return { subscribe: () => {} };
						},
						getCurrentPhoneNumber: () => {
							return { subscribe: () => {} };
						}
					}
				}
			]
		});
	});

	it('should be created', inject([BillsService], (service: BillsService) => {
		expect(service).toBeDefined();
	}));
	it('download UserBill should work', inject(
		[BillsService],
		(service: BillsService) => {
			const bill = {
				url: null,
				status: 1,
				file: 'JVBERi0xLjQNCiWTjIueIFJlcG9ydExhYiBHZW',
				typefile: null,
				downloading: true
			};
			service.downloadUserBill(bill);
			expect(bill.downloading).toEqual(true);
		}
	));
});
