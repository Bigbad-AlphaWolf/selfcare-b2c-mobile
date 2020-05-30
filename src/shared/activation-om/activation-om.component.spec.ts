import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationOmComponent } from './activation-om.component';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { of } from 'rxjs';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('ActivationOmComponent', () => {
  let component: ActivationOmComponent;
  let fixture: ComponentFixture<ActivationOmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [ActivationOmComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
            getCurrentPhoneNumber: () => {},
            getMainPhoneNumber: () => { 
              return ""
             },
             getAttachedNumbers: () => { 
              return of()
             }
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
          provide: MatDialogRef
        },
        FormBuilder,
        { provide: Validators, useValue: {} },
        { provide: FormGroup, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationOmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
