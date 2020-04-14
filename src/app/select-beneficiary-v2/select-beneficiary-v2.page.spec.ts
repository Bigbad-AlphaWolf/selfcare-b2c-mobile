import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBeneficiaryV2Page } from './select-beneficiary-v2.page';

describe('SelectBeneficiaryV2Page', () => {
  let component: SelectBeneficiaryV2Page;
  let fixture: ComponentFixture<SelectBeneficiaryV2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBeneficiaryV2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
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
