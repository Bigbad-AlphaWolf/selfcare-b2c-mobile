import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPassAmountPage } from './credit-pass-amount.page';

describe('CreditPassAmountPage', () => {
  let component: CreditPassAmountPage;
  let fixture: ComponentFixture<CreditPassAmountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditPassAmountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditPassAmountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
