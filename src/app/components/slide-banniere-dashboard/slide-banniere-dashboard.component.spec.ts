import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { UrlSerializer } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';

import { SlideBanniereDashboardComponent } from './slide-banniere-dashboard.component';

describe( 'SlideBanniereDashboardComponent', () => {
	let component: SlideBanniereDashboardComponent;
	let fixture: ComponentFixture<SlideBanniereDashboardComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			providers: [
				{
					provide: InAppBrowser,
					usevalue: {}
				},
				{
					provide: MatDialog,
					usevalue: {}
				},
				{
					provide: HttpClient,
					usevalue: {}
				},
				{
					provide: ModalController,
					usevalue: {}
				},
				{
					provide: MatBottomSheet,
					usevalue: {}
				},
				{
					provide: UrlSerializer,
					usevalue: {}
				},
				{
					provide: Location,
					usevalue: {}
				}
			],
			declarations: [SlideBanniereDashboardComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( SlideBanniereDashboardComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
