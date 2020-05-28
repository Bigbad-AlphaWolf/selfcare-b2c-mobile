import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergenciesPage } from './emergencies.page';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';

describe('EmergenciesPage', () => {
  let component: EmergenciesPage;
  let fixture: ComponentFixture<EmergenciesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmergenciesPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: HttpClient,
          useValue: {
            get: () => {
              return of();
            },
          },
        },
        { provide: MatDialog },
        { provide: Router },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergenciesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
