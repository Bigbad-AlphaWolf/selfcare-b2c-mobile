import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertOmSetAmountPage } from './transfert-om-set-amount.page';

describe('TransfertOmSetAmountPage', () => {
  let component: TransfertOmSetAmountPage;
  let fixture: ComponentFixture<TransfertOmSetAmountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfertOmSetAmountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfertOmSetAmountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
