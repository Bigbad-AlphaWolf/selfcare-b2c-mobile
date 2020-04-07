import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPassInternetV3Page } from './list-pass-internet-v3.page';

describe('ListPassInternetV3Page', () => {
  let component: ListPassInternetV3Page;
  let fixture: ComponentFixture<ListPassInternetV3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPassInternetV3Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPassInternetV3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
