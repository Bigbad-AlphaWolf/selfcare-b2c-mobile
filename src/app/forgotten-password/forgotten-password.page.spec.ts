import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgottenPasswordPage } from './forgotten-password.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Uid } from '@ionic-native/uid/ngx';
import { Network } from '@ionic-native/network/ngx';

describe( 'ForgottenPasswordPage', () => {
	let component: ForgottenPasswordPage;
	let fixture: ComponentFixture<ForgottenPasswordPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ForgottenPasswordPage],
			imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: Location },
				{ provide: Uid },
				{ provide: Network },
				{
					provide: HttpClient,
					useValue: {
						post: () => {
							return of();
						},
						get: () => {
							return of();
						},
					},
				},
			],
		} ).compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( ForgottenPasswordPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
