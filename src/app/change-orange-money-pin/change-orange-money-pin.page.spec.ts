import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UrlSerializer } from '@angular/router';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';

import { ChangeOrangeMoneyPinPage } from './change-orange-money-pin.page';

describe( 'ChangeOrangeMoneyPinPage', () => {
	let component: ChangeOrangeMoneyPinPage;
	let fixture: ComponentFixture<ChangeOrangeMoneyPinPage>;

	beforeEach(
		waitForAsync( () => {
			TestBed.configureTestingModule( {
				imports: [FormsModule, ReactiveFormsModule],
				providers: [
					{
						provide: ModalController,
					},
					{
						provide: Location,
					},
					{
						provide: AngularDelegate,
					},
					{
						provide: UrlSerializer,
					},
					{
						provide: OrangeMoneyService,
						useValue: {
							changePin: () => {
								return of();
							},
						},
					},
					{
						provide: FollowAnalyticsService,
						useValue: {
							registerEventFollow: () => { },
						},
					},
				],
				declarations: [ChangeOrangeMoneyPinPage],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			} ).compileComponents();
		} )
	);

	beforeEach( () => {
		fixture = TestBed.createComponent( ChangeOrangeMoneyPinPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
