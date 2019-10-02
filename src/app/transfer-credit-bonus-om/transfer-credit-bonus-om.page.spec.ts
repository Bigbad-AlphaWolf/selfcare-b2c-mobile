import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCreditBonusOmPage } from './transfer-credit-bonus-om.page';

describe('TransferCreditBonusOmPage', () => {
  let component: TransferCreditBonusOmPage;
  let fixture: ComponentFixture<TransferCreditBonusOmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferCreditBonusOmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferCreditBonusOmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
