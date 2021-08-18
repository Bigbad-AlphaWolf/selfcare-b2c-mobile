import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TransferSetAmountPage } from './transfer-set-amount.page';

describe('TransferSetAmountPage', () => {
  let component: TransferSetAmountPage;
  let fixture: ComponentFixture<TransferSetAmountPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TransferSetAmountPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [{ provide: ActivatedRoute, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferSetAmountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
