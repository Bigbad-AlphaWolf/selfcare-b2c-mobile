import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSetAmountPage } from './transfer-set-amount.page';

describe('TransferSetAmountPage', () => {
  let component: TransferSetAmountPage;
  let fixture: ComponentFixture<TransferSetAmountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferSetAmountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferSetAmountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
