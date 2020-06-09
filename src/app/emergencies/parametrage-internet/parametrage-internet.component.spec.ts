import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrageInternetComponent } from './parametrage-internet.component';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MatDialogRef, MatDialog } from '@angular/material';

describe('ParametrageInternetComponent', () => {
  let component: ParametrageInternetComponent;
  let fixture: ComponentFixture<ParametrageInternetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParametrageInternetComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
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
    fixture = TestBed.createComponent(ParametrageInternetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
