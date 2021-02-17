import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistanceHubPage } from './assistance-hub.page';

describe('AssistanceHubPage', () => {
  let component: AssistanceHubPage;
  let fixture: ComponentFixture<AssistanceHubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistanceHubPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistanceHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
