import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController, ToastController } from '@ionic/angular';
import { off } from 'process';
import { of } from 'rxjs';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';

import { BillsHubPage } from './bills-hub.page';

describe( 'BillsHubPage', () => {
	let component: BillsHubPage;
	let fixture: ComponentFixture<BillsHubPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			providers: [
				{
					provide: MatBottomSheet
				},
				{
					provide: MatDialog
				},
				{
					provide: UrlSerializer
				},
				{
					provide: Location
				},
				{
					provide: ModalController
				},
				{
					provide: ToastController
				},
				{
					provide: OrangeMoneyService,
					useValue: {
						omAccountSession: () => {
							return of()
						}
					}
				},
				{
					provide: OperationService,
					useValue: {
						getServicesByFormule: () => {
							return of()
						}
					}
				},
				{
					provide: FollowAnalyticsService,
					useValue: {
						registerEventFollow: () => {
							return ""
						}
					}
				},
				{
					provide: BottomSheetService,
					useValue: {
						initBsModal: () => {
							return of()
						},
						openModal: () => {
							return ""
						}
					}
				}
			],
			declarations: [BillsHubPage],
			imports: [RouterTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( BillsHubPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
