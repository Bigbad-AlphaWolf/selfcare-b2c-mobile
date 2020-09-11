import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegistrationPage } from './new-registration.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatSelectModule,
  MatFormFieldModule,
  MatDialogRef,
  MatDialog,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('NewRegistrationPage', () => {
  let component: NewRegistrationPage;
  let fixture: ComponentFixture<NewRegistrationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewRegistrationPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: ModalController, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: Router, useValue: {} },
        {
          provide: HttpClient,
          useValue: {
            post: () => {
              return of();
            },
            get: () => {
              return of();
            },
          },
        }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
