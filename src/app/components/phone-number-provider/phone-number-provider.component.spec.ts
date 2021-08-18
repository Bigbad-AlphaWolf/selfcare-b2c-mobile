import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Contacts } from '@ionic-native/contacts';

import { PhoneNumberProviderComponent } from './phone-number-provider.component';

describe('PhoneNumberProviderComponent', () => {
  let component: PhoneNumberProviderComponent;
  let fixture: ComponentFixture<PhoneNumberProviderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, FormsModule],
        providers: [
          {
            provide: MatDialog,
            useValue: {},
          },
          {
            provide: Contacts,
            useValue: {},
          },
        ],
        declarations: [PhoneNumberProviderComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PhoneNumberProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
