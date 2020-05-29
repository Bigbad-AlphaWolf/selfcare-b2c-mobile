import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBeneficiaryV2Page } from './select-beneficiary-v2.page';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material';
import { Contacts } from '@ionic-native/contacts';

describe('SelectBeneficiaryV2Page', () => {
  let component: SelectBeneficiaryV2Page;
  let fixture: ComponentFixture<SelectBeneficiaryV2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectBeneficiaryV2Page, PhoneNumberDisplayPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router },
        { provide: MatDialog },
        { provide: Contacts },
        { provide: ActivatedRoute },
        {
          provide: HttpClient,
          useValue: {
            get() {
              return of();
            },
            post() {
              return of();
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBeneficiaryV2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
