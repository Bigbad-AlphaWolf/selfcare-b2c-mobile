import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CancelOperationPopupComponent } from './cancel-operation-popup.component';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material';
import { Router } from '@angular/router';
import { Market } from '@ionic-native/market/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularDelegate } from '@ionic/angular';

describe('CancelOperationPopupComponent', () => {
  let component: CancelOperationPopupComponent;
  let fixture: ComponentFixture<CancelOperationPopupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          MatDialogModule,
          FormsModule,
          ReactiveFormsModule,
        ],
        declarations: [CancelOperationPopupComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          AngularDelegate,
          {
            provide: MAT_DIALOG_DATA,
            useValue: {},
          },
          {
            provide: MatDialogRef,
            useValue: {},
          },
          {
            provide: Router,
            useValue: {},
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
