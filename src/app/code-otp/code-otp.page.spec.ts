import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeOtpPage } from './code-otp.page';

describe('CodeOtpPage', () => {
  let component: CodeOtpPage;
  let fixture: ComponentFixture<CodeOtpPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeOtpPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeOtpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
