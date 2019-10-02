import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckNumberPage } from './check-number.page';

describe('CheckNumberPage', () => {
  let component: CheckNumberPage;
  let fixture: ComponentFixture<CheckNumberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckNumberPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckNumberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
