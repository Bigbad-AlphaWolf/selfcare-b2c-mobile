import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {NewPinpadModalPage} from './new-pinpad-modal.page';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MatDialogRef, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {Router, UrlSerializer} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {of} from 'rxjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModalController, NavController} from '@ionic/angular';
import {PhoneNumberDisplayPipe} from 'src/shared/pipes/phone-number-display.pipe';
import {ApplicationRoutingService} from '../services/application-routing/application-routing.service';
import {MaterialComponentsModule} from '../material-components/material-components.module';

describe('NewPinpadModalPage', () => {
  let component: NewPinpadModalPage;
  let fixture: ComponentFixture<NewPinpadModalPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NewPinpadModalPage, PhoneNumberDisplayPipe],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        imports: [FormsModule, ReactiveFormsModule, MaterialComponentsModule, BrowserAnimationsModule],
        providers: [
          {provide: ApplicationRoutingService, useValue: {}},
          {
            provide: UrlSerializer,
            useValue: {}
          },
          {provide: MatDialogRef, useValue: {}},
          {provide: ModalController, useValue: {}},
          {provide: MatDialog, useValue: {}},
          {provide: Router, useValue: {}},
          {provide: NavController, useValue: {}},
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
    fixture = TestBed.createComponent(NewPinpadModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
