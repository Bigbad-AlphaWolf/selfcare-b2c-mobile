import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {SargalRegistrationPage} from './sargal-registration.page';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {SargalService} from 'src/app/services/sargal-service/sargal.service';
import {DashboardService} from 'src/app/services/dashboard-service/dashboard.service';
import {FollowAnalyticsService} from 'src/app/services/follow-analytics/follow-analytics.service';
import {OverlayModule} from '@angular/cdk/overlay';

describe('SargalRegistrationPage', () => {
  let component: SargalRegistrationPage;
  let fixture: ComponentFixture<SargalRegistrationPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SargalRegistrationPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule, OverlayModule, MatDialogModule],
        providers: [
          {provide: MatDialog},
          {provide: MatDialogRef, useValue: {}},
          {
            provide: SargalService,
            useValue: {
              registerToSargal: () => {
                return of();
              }
            }
          },
          {
            provide: DashboardService,
            useValue: {
              getCurrentPhoneNumber: () => {
                return '';
              }
            }
          },
          {
            provide: FollowAnalyticsService,
            useValue: {
              registerEventFollow: () => {
                return '';
              }
            }
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SargalRegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
