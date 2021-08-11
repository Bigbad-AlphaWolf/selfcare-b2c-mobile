import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationSuccessFailModalPage } from './operation-success-fail-modal.page';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';
import { CodeFormatPipe } from '../pipes/code-format/code-format.pipe';
import { RouterTestingModule } from '@angular/router/testing';

describe( 'OperationSuccessFailModalPage', () => {
	let component: OperationSuccessFailModalPage;
	let fixture: ComponentFixture<OperationSuccessFailModalPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [OperationSuccessFailModalPage, PhoneNumberDisplayPipe, CodeFormatPipe],
			imports: [RouterTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: HttpClient },
				{ provide: Location },
				{ provide: ModalController },
			],
		} ).compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( OperationSuccessFailModalPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
