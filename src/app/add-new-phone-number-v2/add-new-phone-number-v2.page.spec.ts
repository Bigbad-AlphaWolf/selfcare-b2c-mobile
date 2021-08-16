import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { HttpClient } from '@angular/common/http';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { MatDialog, MatDialogModule } from '@angular/material';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddNewPhoneNumberV2Page } from './add-new-phone-number-v2.page';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';

describe('AddNewPhoneNumberV2Page', () => {
  let component: AddNewPhoneNumberV2Page;
  let fixture: ComponentFixture<AddNewPhoneNumberV2Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewPhoneNumberV2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        MatDialogModule
    ],
      providers: [
        { provide: Router },
        { provide: Deeplinks },
        {
          provide: HttpClient,
          useValue: {}
        },
        {
          provide: AppMinimize,
          useValue: {}
        },
        {
          provide: FollowAnalyticsService,
          useValue: {}
        },
        {
          provide: ActivatedRoute,
          useValue: {}
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewPhoneNumberV2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('current phone number should be valid', () => {
    component.currentUserNumber = '777777777';
    expect(component.validNumber(component.currentUserNumber)).toBeTruthy();
  });

  it('current phone number should be valid', () => {
    component.currentUserNumber = '123456789';
    expect(component.validNumber(component.currentUserNumber)).toBeFalsy();
  });
});

