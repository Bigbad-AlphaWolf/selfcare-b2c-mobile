import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationSuccessOrFailComponent } from './operation-success-or-fail.component';

describe('OperationSuccessOrFailComponent', () => {
  let component: OperationSuccessOrFailComponent;
  let fixture: ComponentFixture<OperationSuccessOrFailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationSuccessOrFailComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationSuccessOrFailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
