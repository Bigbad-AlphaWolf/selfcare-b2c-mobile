import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OperationSuccessOrFailComponent } from './operation-success-or-fail.component';
import { MatDialogModule } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularDelegate } from '@ionic/angular';

describe('OperationSuccessOrFailComponent', () => {
  let component: OperationSuccessOrFailComponent;
  let fixture: ComponentFixture<OperationSuccessOrFailComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, MatDialogModule],
        declarations: [OperationSuccessOrFailComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          AngularDelegate,
          { provide: Router, useValue: {} },
          {
            provide: HttpClient,
            useValue: {},
          },
          {
            provide: AppVersion,
            useValue: {},
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationSuccessOrFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
