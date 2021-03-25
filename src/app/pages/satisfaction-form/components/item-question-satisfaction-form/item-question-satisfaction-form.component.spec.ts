import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemQuestionSatisfactionFormComponent } from './item-question-satisfaction-form.component';

describe('ItemQuestionSatisfactionFormComponent', () => {
  let component: ItemQuestionSatisfactionFormComponent;
  let fixture: ComponentFixture<ItemQuestionSatisfactionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemQuestionSatisfactionFormComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemQuestionSatisfactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
