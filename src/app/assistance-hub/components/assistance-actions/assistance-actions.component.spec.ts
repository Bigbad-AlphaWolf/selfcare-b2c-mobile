import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistanceActionsComponent } from './assistance-actions.component';

describe('AssistanceActionsComponent', () => {
  let component: AssistanceActionsComponent;
  let fixture: ComponentFixture<AssistanceActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistanceActionsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistanceActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
