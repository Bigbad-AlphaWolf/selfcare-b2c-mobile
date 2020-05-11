import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBeneficiaryPopUpComponent } from './select-beneficiary-pop-up.component';

describe('SelectBeneficiaryPopUpComponent', () => {
  let component: SelectBeneficiaryPopUpComponent;
  let fixture: ComponentFixture<SelectBeneficiaryPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectBeneficiaryPopUpComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectBeneficiaryPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
