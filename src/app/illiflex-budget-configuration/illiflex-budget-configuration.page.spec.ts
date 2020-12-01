import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IlliflexBudgetConfigurationPage } from './illiflex-budget-configuration.page';

describe('IlliflexBudgetConfigurationPage', () => {
  let component: IlliflexBudgetConfigurationPage;
  let fixture: ComponentFixture<IlliflexBudgetConfigurationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IlliflexBudgetConfigurationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IlliflexBudgetConfigurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
