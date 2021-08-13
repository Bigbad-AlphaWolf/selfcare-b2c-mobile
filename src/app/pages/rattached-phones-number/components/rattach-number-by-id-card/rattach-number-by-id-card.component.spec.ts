import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { AccountService } from 'src/app/services/account-service/account.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';

import { RattachNumberByIdCardComponent } from './rattach-number-by-id-card.component'

describe( 'RattachNumberByIdCardComponent', () => {
	let component: RattachNumberByIdCardComponent;
	let fixture: ComponentFixture<RattachNumberByIdCardComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [RattachNumberByIdCardComponent],
			imports: [ReactiveFormsModule, FormsModule],
			providers: [
				{
					provide: ModalController
				},
				{
					provide: DashboardService,
					useValue: {
						getMainPhoneNumber: () => { }
					}
				},
				{
					provide: AccountService,
					useValue: {
						attachNumberByIdCard: () => {
							return of()
						}
					}
				}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( RattachNumberByIdCardComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
