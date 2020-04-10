import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPinpadModalPage } from './new-pinpad-modal.page';

describe('NewPinpadModalPage', () => {
  let component: NewPinpadModalPage;
  let fixture: ComponentFixture<NewPinpadModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPinpadModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPinpadModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
