import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {CguPopupComponent} from './cgu-popup.component';
import {MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

describe('CguPopupComponent', () => {
  let component: CguPopupComponent;
  let fixture: ComponentFixture<CguPopupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CguPopupComponent],
        imports: [RouterTestingModule, MatDialogModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: MatDialogRef,
            useValue: {}
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {}
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CguPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
