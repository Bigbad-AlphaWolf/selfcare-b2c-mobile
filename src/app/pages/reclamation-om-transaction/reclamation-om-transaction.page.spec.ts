import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamationOmTransactionPage } from './reclamation-om-transaction.page';

describe('ReclamationOmTransactionPage', () => {
  let component: ReclamationOmTransactionPage;
  let fixture: ComponentFixture<ReclamationOmTransactionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReclamationOmTransactionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReclamationOmTransactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
