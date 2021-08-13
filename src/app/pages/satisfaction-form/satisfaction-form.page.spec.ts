import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FormulaireSatisfactionService } from 'src/app/services/formulaire-satisfaction-service/formulaire-satisfaction.service';

import { SatisfactionFormPage } from './satisfaction-form.page';

describe( 'SatisfactionFormPage', () => {
	let component: SatisfactionFormPage;
	let fixture: ComponentFixture<SatisfactionFormPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [SatisfactionFormPage],
			imports: [RouterTestingModule],
			providers: [
				{
					provide: Location
				},
				{
					provide: MatDialog
				},
				{
					provide: FormulaireSatisfactionService,
					useValue: {
						queryQuestions: () => {
							return of()
						},
						submitSurvey: () => {
							return of()
						}
					}
				},
				{
					provide: DashboardService,
					useValue: {
						getCurrentPhoneNumber: () => {
							return ""
						}
					}
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( SatisfactionFormPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
