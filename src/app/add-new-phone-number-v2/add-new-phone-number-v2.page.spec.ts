import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewPhoneNumberV2Page } from './add-new-phone-number-v2.page';

describe('AddNewPhoneNumberV2Page', () => {
  let component: AddNewPhoneNumberV2Page;
  let fixture: ComponentFixture<AddNewPhoneNumberV2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewPhoneNumberV2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewPhoneNumberV2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
