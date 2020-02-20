import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { HttpClient } from '@angular/common/http';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { MatDialog } from '@angular/material';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPhoneNumberV2Page } from './add-new-phone-number-v2.page';

describe('AddNewPhoneNumberV2Page', () => {
  let component: AddNewPhoneNumberV2Page;
  let dservice: DashboardService;
  let dialog: MatDialog;
  let follow: FollowAnalyticsService;
  const mockHttp = jasmine.createSpyObj(['get']);
  const service = new AuthenticationService(mockHttp);
  dservice = new DashboardService(mockHttp, service);
  component = new AddNewPhoneNumberV2Page(dservice, dialog, follow);
  dservice.getCurrentPhoneNumber = () => '777777777';
  component.ngOnInit();
  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.currentUserNumber).toEqual('777777777');
  });

  it('current number should be valid', () => {
    expect(component.validNumber(component.currentUserNumber)).toBeTruthy();
  });
});
