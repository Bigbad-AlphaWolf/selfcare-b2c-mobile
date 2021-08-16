import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuccessFailPopupComponent } from './success-fail-popup.component';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { of } from 'rxjs';
import { MatDialogRef, MatButtonModule, MatInputModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatFormFieldModule, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SuccessFailPopupComponent', () => {
  let component: SuccessFailPopupComponent;
  let fixture: ComponentFixture<SuccessFailPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessFailPopupComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatFormFieldModule
    ],
      providers: [
        {
          provide: Router
        },
        {
          provide: HttpClient
        },
        {
          provide: ActivatedRoute
        },
        {
          provide: DashboardService,
          useValue: {
            buyPassByCredit: () => {},
            getCurrentPhoneNumber: () => {}
          }
        },
        {
          provide: AuthenticationService,
          useValue: {
            getSubscription: () => {
              return of();
            }
          }
        },
        {
          provide: MatDialogRef,
          useValue: {disableClose: true}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessFailPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
