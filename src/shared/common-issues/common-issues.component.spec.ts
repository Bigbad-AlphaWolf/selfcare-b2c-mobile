import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonIssuesComponent } from './common-issues.component';
import { MatDialogRef, MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController } from '@ionic/angular';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { of } from 'rxjs';

describe( 'CommonIssuesComponent', () => {
	let component: CommonIssuesComponent;
	let fixture: ComponentFixture<CommonIssuesComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [CommonIssuesComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			imports: [RouterTestingModule],
			providers: [
				{
					provide: MatDialogRef,
					useValue: {}
				},
				{
					provide: MAT_BOTTOM_SHEET_DATA,
					useValue: {}
				},
				{
					provide: MatBottomSheetRef,
					useValue: {}
				},
				{
					provide: OpenNativeSettings,
					useValue: {
						open: () => {
							return of().toPromise()
						}
					}
				},
				{
					provide: ModalController
				}
			]
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( CommonIssuesComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
