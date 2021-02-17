import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleOperationSuccessModalComponent } from './simple-operation-success-modal.component';

describe('SimpleOperationSuccessModalComponent', () => {
  let component: SimpleOperationSuccessModalComponent;
  let fixture: ComponentFixture<SimpleOperationSuccessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleOperationSuccessModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleOperationSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});