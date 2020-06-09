import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonIssuesComponent } from './common-issues.component';
import { MatDialogRef, MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { Router } from '@angular/router';

describe('CommonIssuesComponent', () => {
  let component: CommonIssuesComponent;
  let fixture: ComponentFixture<CommonIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonIssuesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_BOTTOM_SHEET_DATA,
          useValue: {}
        },
        {
          provide: MatBottomSheetRef,
          useValue: {}
        },
        {
          provide: Router,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
