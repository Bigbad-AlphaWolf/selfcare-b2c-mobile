import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyAccountPage } from './my-account.page';
import { MatDialogRef, MatDialog, MatBottomSheet } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('MyAccountPage', () => {
  let component: MyAccountPage;
  let fixture: ComponentFixture<MyAccountPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MyAccountPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule],
        providers: [
          { provide: MatDialogRef, useValue: {} },
          { provide: MatDialog, useValue: {} },
          { provide: ModalController, useValue: {} },
          { provide: MatBottomSheet, useValue: {} },
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
