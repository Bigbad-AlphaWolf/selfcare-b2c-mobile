import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RapidOperationPage } from './rapid-operation.page';

describe('RapidOperationPage', () => {
  let component: RapidOperationPage;
  let fixture: ComponentFixture<RapidOperationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapidOperationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapidOperationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
