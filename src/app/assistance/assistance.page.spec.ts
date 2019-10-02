import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistancePage } from './assistance.page';

describe('AssistancePage', () => {
  let component: AssistancePage;
  let fixture: ComponentFixture<AssistancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistancePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
