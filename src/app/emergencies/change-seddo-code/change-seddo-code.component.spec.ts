import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {ChangeSeddoCodeComponent} from './change-seddo-code.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PhoneNumberDisplayPipe} from 'src/shared/pipes/phone-number-display.pipe';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {of} from 'rxjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialComponentsModule} from 'src/app/material-components/material-components.module';

describe('ChangeSeddoCodeComponent', () => {
  let component: ChangeSeddoCodeComponent;
  let fixture: ComponentFixture<ChangeSeddoCodeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ChangeSeddoCodeComponent, PhoneNumberDisplayPipe],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        imports: [FormsModule, ReactiveFormsModule, BrowserAnimationsModule, MaterialComponentsModule, MatDialogModule],
        providers: [
          {
            provide: HttpClient,
            useValue: {
              get: () => {
                return of();
              }
            }
          },
          {provide: MatDialog}
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSeddoCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
