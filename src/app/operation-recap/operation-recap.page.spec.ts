import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationRecapPage } from './operation-recap.page';

describe('OperationRecapPage', () => {
  let component: OperationRecapPage;
  let fixture: ComponentFixture<OperationRecapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationRecapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationRecapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
