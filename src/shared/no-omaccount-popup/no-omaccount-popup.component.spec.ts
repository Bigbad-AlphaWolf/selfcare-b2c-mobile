import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {NoOMAccountPopupComponent} from './no-omaccount-popup.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';

describe('NoOMAccountPopupComponent', () => {
  let component: NoOMAccountPopupComponent;
  let fixture: ComponentFixture<NoOMAccountPopupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NoOMAccountPopupComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: MAT_DIALOG_DATA,
            useValue: {}
          },
          {
            provide: MatDialogRef,
            useValue: {}
          },
          {
            provide: Router,
            useValue: {}
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NoOMAccountPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
