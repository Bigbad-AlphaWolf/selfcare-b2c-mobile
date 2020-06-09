import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParrainagePage } from './parrainage.page';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { MatDialog, MatDialogRef } from '@angular/material';
import { of } from 'rxjs';

describe('ParrainagePage', () => {
  let component: ParrainagePage;
  let fixture: ComponentFixture<ParrainagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParrainagePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: HttpClient,
          useValue: {
            get() {
              return of();
            },
          },
        },
        { provide: Router },
        { provide: ModalController },
        { provide: MatDialog },
        { provide: MatDialogRef },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParrainagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
