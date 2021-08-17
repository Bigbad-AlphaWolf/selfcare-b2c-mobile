import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddNumberByIdClientPage } from './add-number-by-id-client.page';
import { ActivatedRoute } from '@angular/router';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { HttpClient } from '@angular/common/http';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { MatDialogModule } from '@angular/material';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'AddNumberByIdClientPage', () => {
	let component: AddNumberByIdClientPage;
	let fixture: ComponentFixture<AddNumberByIdClientPage>;

	beforeEach( waitForAsync( () => {
		TestBed.configureTestingModule( {
			declarations: [AddNumberByIdClientPage],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			imports: [
				MatDialogModule, RouterTestingModule
			],
			providers: [
				{ provide: Deeplinks },
				{
					provide: HttpClient,
					useValue: {}
				},
				{
					provide: AppMinimize,
					useValue: {}
				},
				{
					provide: FollowAnalyticsService,
					useValue: {}
				},
				{
					provide: ActivatedRoute,
					useValue: {}
				}
			]
		} ).compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( AddNumberByIdClientPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
