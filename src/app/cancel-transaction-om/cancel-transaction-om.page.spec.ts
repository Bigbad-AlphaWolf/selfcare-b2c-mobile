import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTransactionOmPage } from './cancel-transaction-om.page';

describe('CancelTransactionOmPage', () => {
  let component: CancelTransactionOmPage;
  let fixture: ComponentFixture<CancelTransactionOmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelTransactionOmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelTransactionOmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
