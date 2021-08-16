import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChangeOrangeMoneyPinPage } from './change-orange-money-pin.page';

describe('ChangeOrangeMoneyPinPage', () => {
  let component: ChangeOrangeMoneyPinPage;
  let fixture: ComponentFixture<ChangeOrangeMoneyPinPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeOrangeMoneyPinPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOrangeMoneyPinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
