import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPassUsagePage } from './list-pass-usage.page';

describe('ListPassUsagePage', () => {
  let component: ListPassUsagePage;
  let fixture: ComponentFixture<ListPassUsagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPassUsagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPassUsagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
