import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordPage } from './change-password.page';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'ChangePasswordPage', () => {
	let component: ChangePasswordPage;
	let fixture: ComponentFixture<ChangePasswordPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ChangePasswordPage],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			imports: [ReactiveFormsModule, RouterTestingModule],
			providers: [
				{ provide: MatDialogRef, useValue: {} },
				{ provide: MatDialog, useValue: {} },
				{ provide: ModalController, useValue: {} },
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
		fixture = TestBed.createComponent( ChangePasswordPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
