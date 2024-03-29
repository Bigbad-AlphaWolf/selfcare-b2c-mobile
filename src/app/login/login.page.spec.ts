import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {LoginPage} from './login.page';
import {MatDialogRef, MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {AngularDelegate, ModalController} from '@ionic/angular';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LoginPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
        providers: [
          AngularDelegate,
          {provide: MatDialogRef, useValue: {}},
          {provide: MatDialog, useValue: {}},
          {provide: ModalController},
          {provide: Location},
          {
            provide: HttpClient,
            useValue: {
              post: () => {
                return of();
              },
              get: () => {
                return of();
              }
            }
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
