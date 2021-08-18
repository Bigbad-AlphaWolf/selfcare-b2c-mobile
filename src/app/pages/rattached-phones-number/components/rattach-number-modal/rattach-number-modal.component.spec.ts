import { OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

import { RattachNumberModalComponent } from './rattach-number-modal.component';

describe('RattachNumberModalComponent', () => {
  let component: RattachNumberModalComponent;
  let fixture: ComponentFixture<RattachNumberModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RattachNumberModalComponent],
        imports: [
          ReactiveFormsModule,
          FormsModule,
          RouterTestingModule,
          OverlayModule,
          MatDialogModule,
        ],
        providers: [
          AngularDelegate,
          {
            provide: MatDialog,
          },
          {
            provide: ModalController,
          },
          {
            provide: DashboardService,
            useValue: {
              registerNumberToAttach: () => {
                return of();
              },
              getMainPhoneNumber: () => {
                return '';
              },
            },
          },
          {
            provide: FollowAnalyticsService,
            useValue: {
              registerEventFollow: () => {
                return '';
              },
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RattachNumberModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
