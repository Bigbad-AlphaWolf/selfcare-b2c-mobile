import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

import { DashboardHeaderComponent } from './dashboard-header.component';

describe( 'DashboardHeaderComponent', () => {
	let component: DashboardHeaderComponent;
	let fixture: ComponentFixture<DashboardHeaderComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [DashboardHeaderComponent],
			imports: [RouterTestingModule],
			providers: [
				{
					provide: Location
				},
				{
					provide: FollowAnalyticsService,
					useValue: {
						registerEventFollow: () => {
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
		fixture = TestBed.createComponent( DashboardHeaderComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
