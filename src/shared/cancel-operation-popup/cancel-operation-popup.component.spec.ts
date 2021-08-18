import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CancelOperationPopupComponent } from './cancel-operation-popup.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Market } from '@ionic-native/market/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('CancelOperationPopupComponent', () => {
  let component: CancelOperationPopupComponent;
  let fixture: ComponentFixture<CancelOperationPopupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, ReactiveFormsModule],
        declarations: [CancelOperationPopupComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: MAT_DIALOG_DATA,
            useValue: {},
          },
          {
            provide: MatDialogRef,
          },
          {
            provide: Router,
          },
          {
            provide: Market,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelOperationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
