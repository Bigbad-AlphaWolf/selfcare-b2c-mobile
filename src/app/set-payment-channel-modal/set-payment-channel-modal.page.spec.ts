import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPaymentChannelModalPage } from './set-payment-channel-modal.page';

describe('TestModalPage', () => {
  let component: SetPaymentChannelModalPage;
  let fixture: ComponentFixture<SetPaymentChannelModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SetPaymentChannelModalPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPaymentChannelModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
