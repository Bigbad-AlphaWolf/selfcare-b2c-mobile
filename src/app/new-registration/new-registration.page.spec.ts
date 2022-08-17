import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {NewRegistrationPage} from './new-registration.page';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogRef, MatDialog} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModalController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {Location} from '@angular/common';
import {Uid} from '@ionic-native/uid/ngx';
import {CodeFormatPipe} from '../pipes/code-format/code-format.pipe';
import {MaterialComponentsModule} from '../material-components/material-components.module';

describe('NewRegistrationPage', () => {
  let component: NewRegistrationPage;
  let fixture: ComponentFixture<NewRegistrationPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NewRegistrationPage, CodeFormatPipe],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        imports: [FormsModule, ReactiveFormsModule, MaterialComponentsModule, BrowserAnimationsModule, RouterTestingModule],
        providers: [
          {provide: MatDialogRef, useValue: {}},
          {provide: ModalController, useValue: {}},
          {provide: MatDialog, useValue: {}},
          {provide: Location},
          {provide: Uid},
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
    fixture = TestBed.createComponent(NewRegistrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
