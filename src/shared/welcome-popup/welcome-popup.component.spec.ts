import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {WelcomePopupComponent} from './welcome-popup.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

describe('WelcomePopupComponent', () => {
  let component: WelcomePopupComponent;
  let fixture: ComponentFixture<WelcomePopupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WelcomePopupComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: MAT_DIALOG_DATA,
            useValue: {}
          },
          {
            provide: MatDialogRef,
            useValue: {}
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
