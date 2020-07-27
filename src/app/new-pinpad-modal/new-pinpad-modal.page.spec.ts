import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPinpadModalPage } from './new-pinpad-modal.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MatDialog,
  MatInputModule,
  MatSelectModule,
  MatFormFieldModule,
} from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalController } from '@ionic/angular';

describe('NewPinpadModalPage', () => {
  let component: NewPinpadModalPage;
  let fixture: ComponentFixture<NewPinpadModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewPinpadModalPage],
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
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPinpadModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
