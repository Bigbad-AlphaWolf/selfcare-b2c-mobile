import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemQuestionSatisfactionFormComponent } from './item-question-satisfaction-form.component';

describe('ItemQuestionSatisfactionFormComponent', () => {
  let component: ItemQuestionSatisfactionFormComponent;
  let fixture: ComponentFixture<ItemQuestionSatisfactionFormComponent>;

  beforeEach(waitForAsync(() => {
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
