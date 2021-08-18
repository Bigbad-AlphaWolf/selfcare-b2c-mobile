import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuySosPage } from './buy-sos.page';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { SosService } from '../services/sos-service/sos.service';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'BuySosPage', () => {
	let component: BuySosPage;
	let fixture: ComponentFixture<BuySosPage>;

	beforeEach( waitForAsync( () => {
		TestBed.configureTestingModule( {
			declarations: [BuySosPage],
			imports: [MatDialogModule, RouterTestingModule],
			providers: [
				{
					provide: DashboardService,
					useValue: {
						getCurrentPhoneNumber: () => { }
					}
				},
				{
					provide: SosService,
					useValue: {
						subscribeToSos: () => { }
					}
				},
				{
					provide: MatDialogRef
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		} ).compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( BuySosPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
