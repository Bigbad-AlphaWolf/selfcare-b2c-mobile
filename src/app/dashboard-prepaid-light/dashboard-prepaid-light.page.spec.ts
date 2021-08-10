import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';

import { DashboardPrepaidLightPage } from './dashboard-prepaid-light.page';

describe( 'DashboardPrepaidLightPage', () => {
	let component: DashboardPrepaidLightPage;
	let fixture: ComponentFixture<DashboardPrepaidLightPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			imports: [RouterTestingModule],
			providers: [
				{
					provide: HttpClient,
					useValue: {
						get: () => {
							return of()
						}
					}
				},
				{
					provide: ModalController,
					useValue: {}
				}
			],
			declarations: [DashboardPrepaidLightPage, FormatCurrencyPipe],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( DashboardPrepaidLightPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
