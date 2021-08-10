import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLinkedNumbersPage } from './delete-linked-numbers.page';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'DeleteLinkedNumbersPage', () => {
	let component: DeleteLinkedNumbersPage;
	let fixture: ComponentFixture<DeleteLinkedNumbersPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [DeleteLinkedNumbersPage],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			imports: [RouterTestingModule],
			providers: [
				{ provide: MatDialogRef, useValue: {} },
				{ provide: MatDialog, useValue: {} },
				{ provide: ModalController },
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
		fixture = TestBed.createComponent( DeleteLinkedNumbersPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
