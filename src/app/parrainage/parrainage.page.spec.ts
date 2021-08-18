import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParrainagePage } from './parrainage.page';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ParrainagePage', () => {
  let component: ParrainagePage;
  let fixture: ComponentFixture<ParrainagePage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ParrainagePage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [ReactiveFormsModule, MatDialogModule, RouterTestingModule],
        providers: [
          AngularDelegate,
          {
            provide: HttpClient,
            useValue: {
              get() {
                return of();
              },
            },
          },
          { provide: ModalController },
          { provide: MatDialog },
          { provide: MatDialogRef, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ParrainagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
