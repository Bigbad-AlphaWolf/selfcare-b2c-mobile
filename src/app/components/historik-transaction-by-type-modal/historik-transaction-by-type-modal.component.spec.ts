import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorikTransactionByTypeModalComponent } from './historik-transaction-by-type-modal.component';

describe('HistorikTransactionByTypeModalComponent', () => {
  let component: HistorikTransactionByTypeModalComponent;
  let fixture: ComponentFixture<HistorikTransactionByTypeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorikTransactionByTypeModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistorikTransactionByTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
