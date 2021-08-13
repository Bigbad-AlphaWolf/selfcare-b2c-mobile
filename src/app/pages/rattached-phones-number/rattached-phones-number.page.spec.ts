import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AccountService } from 'src/app/services/account-service/account.service';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';

import { RattachedPhonesNumberPage } from './rattached-phones-number.page';

describe( 'RattachedPhonesNumberPage', () => {
	let component: RattachedPhonesNumberPage;
	let fixture: ComponentFixture<RattachedPhonesNumberPage>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [RattachedPhonesNumberPage, PhoneNumberDisplayPipe],
			imports: [RouterTestingModule],
			providers: [
				{
					provide: DashboardService,
					useValue: {
						attachedNumbersChanged: of(),
						getCurrentPhoneNumber: () => {
							return ""
						},
						getAllOemNumbers: () => {
							return of()
						},
						setCurrentPhoneNumber: () => {
							return ""
						}
					}
				},
				{
					provide: BottomSheetService,
					useValue: {
						openRattacheNumberModal: () => {
							return ""
						}
					}
				},
				{
					provide: AccountService,
					useValue: {
						deleteUserLinkedPhoneNumbers: () => {
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
		fixture = TestBed.createComponent( RattachedPhonesNumberPage );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
