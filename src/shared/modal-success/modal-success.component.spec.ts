import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalSuccessComponent } from './modal-success.component';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('ModalSuccessComponent', () => {
  let component: ModalSuccessComponent;
  let fixture: ComponentFixture<ModalSuccessComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ModalSuccessComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule],
        providers: [
          {
            provide: Location,
          },
          {
            provide: MatDialogRef,
            useValue: {},
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {},
          },
          {
            provide: DashboardService,
            useValue: {
              getCurrentPhoneNumber: () => {
                return '';
              },
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
