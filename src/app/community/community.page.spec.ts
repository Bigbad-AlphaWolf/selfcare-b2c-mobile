import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, UrlSerializer } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { CommunityService } from '../services/community-service/community.service';

import { CommunityPage } from './community.page';

describe('CommunityPage', () => {
  let component: CommunityPage;
  let fixture: ComponentFixture<CommunityPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: Router,
          },
          {
            provide: ModalController,
          },
          {
            provide: CommunityService,
            useValue: {
              getArticlesCategories: () => {
                return of();
              },
              getFamousArticles: () => {
                return of();
              },
              getRecommendedArticles: () => {
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
        declarations: [CommunityPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
