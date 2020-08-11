import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStatusPage } from './request-status.page';

describe('RequestStatusPage', () => {
  let component: RequestStatusPage;
  let fixture: ComponentFixture<RequestStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestStatusPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
