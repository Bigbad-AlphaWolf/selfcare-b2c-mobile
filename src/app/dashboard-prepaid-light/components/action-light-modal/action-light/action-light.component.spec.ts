import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';

import { ActionLightComponent } from './action-light.component';

describe( 'ActionLightComponent', () => {
	let component: ActionLightComponent;
	let fixture: ComponentFixture<ActionLightComponent>;

	beforeEach(
		waitForAsync( () => {
			TestBed.configureTestingModule( {
				imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
				providers: [
					{
						provide: ModalController,
					},
					{
						provide: AngularDelegate,
					},
					{
						provide: HttpClient,
						useValue: {
							get: () => {
								return of();
							},
						},
					},
					{
						provide: AuthenticationService,
						useValue: {
							login: () => {
								return of();
							},
						},
					},
					{
						provide: DashboardService,
						useValue: {
							getCurrentPhoneNumber: () => { },
						},
					},
				],
				declarations: [ActionLightComponent],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			} ).compileComponents();
		} )
	);

	beforeEach( () => {
		fixture = TestBed.createComponent( ActionLightComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
