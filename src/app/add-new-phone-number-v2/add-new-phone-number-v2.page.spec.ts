import {HttpClient} from '@angular/common/http';
import {FollowAnalyticsService} from 'src/app/services/follow-analytics/follow-analytics.service';
import {MatDialogModule} from '@angular/material/dialog';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {AddNewPhoneNumberV2Page} from './add-new-phone-number-v2.page';
import {AppMinimize} from '@ionic-native/app-minimize/ngx';
import {RouterTestingModule} from '@angular/router/testing';

describe('AddNewPhoneNumberV2Page', () => {
  let component: AddNewPhoneNumberV2Page;
  let fixture: ComponentFixture<AddNewPhoneNumberV2Page>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AddNewPhoneNumberV2Page],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [MatDialogModule, RouterTestingModule],
        providers: [
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
          }
        ]
      }).compileComponents();
    })
  );

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
