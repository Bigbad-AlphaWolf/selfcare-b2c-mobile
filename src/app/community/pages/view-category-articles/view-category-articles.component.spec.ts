import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { CommunityService } from 'src/app/services/community-service/community.service';

import { ViewCategoryArticlesComponent } from './view-category-articles.component';

describe( 'ViewCategoryArticlesComponent', () => {
	let component: ViewCategoryArticlesComponent;
	let fixture: ComponentFixture<ViewCategoryArticlesComponent>;

	beforeEach(
		waitForAsync( () => {
			TestBed.configureTestingModule( {
				providers: [
					{
						provide: NavController,
					},
					{
						provide: CommunityService,
						useValue: {
							getArticlesByCategory: () => {
								return of();
							},
						},
					},
					{
						provide: UrlSerializer,
					},
					{
						provide: Location,
					},
				],
				declarations: [ViewCategoryArticlesComponent],
				imports: [RouterTestingModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			} ).compileComponents();
		} )
	);

	beforeEach( () => {
		fixture = TestBed.createComponent( ViewCategoryArticlesComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );
} );
