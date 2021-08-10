import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { of } from 'rxjs';

import { TakePictureComponent } from './take-picture.component';

describe( 'TakePictureComponent', () => {
	let component: TakePictureComponent;
	let fixture: ComponentFixture<TakePictureComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			providers: [
				{
					provide: CameraPreview,
					useValue: {
						startCamera: () => {
							return of().toPromise()
						}
					}
				},
				{
					provide: UrlSerializer,
					useValue: {}
				},
				{
					provide: Location,
					useValue: {}
				}
			],
			declarations: [TakePictureComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( TakePictureComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
