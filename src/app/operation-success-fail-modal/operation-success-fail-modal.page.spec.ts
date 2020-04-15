import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationSuccessFailModalPage } from './operation-success-fail-modal.page';

describe('OperationSuccessFailModalPage', () => {
  let component: OperationSuccessFailModalPage;
  let fixture: ComponentFixture<OperationSuccessFailModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationSuccessFailModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationSuccessFailModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
