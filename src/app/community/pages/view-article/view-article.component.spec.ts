import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, UrlSerializer } from '@angular/router';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { CommunityService } from 'src/app/services/community-service/community.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';

import { ViewArticleComponent } from './view-article.component';

describe('ViewArticleComponent', () => {
  let component: ViewArticleComponent;
  let fixture: ComponentFixture<ViewArticleComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, ReactiveFormsModule],
        providers: [
          {
            provide: Location,
          },
          {
            provide: NavController,
          },
          {
            provide: Router,
            useValue: {
              getCurrentNavigation: () => {
                return {
                  extras: {
                    state: {
                      article: null,
                    },
                  },
                };
              },
            },
          },
          {
            provide: CommunityService,
            useValue: {
              postComment: () => {
                return of();
              },
            },
          },
          {
            provide: DashboardService,
            useValue: {
              getMainPhoneNumber: () => {
                return '';
              },
              getCustomerInformations: () => {
                return of();
              },
            },
          },
          {
            provide: UrlSerializer,
          },
        ],
        declarations: [ViewArticleComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
