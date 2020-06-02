import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeCardNumberComponent } from './recharge-card-number.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('RechargeCardNumberComponent', () => {
  let component: RechargeCardNumberComponent;
  let fixture: ComponentFixture<RechargeCardNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RechargeCardNumberComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule],
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
    fixture = TestBed.createComponent(RechargeCardNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
