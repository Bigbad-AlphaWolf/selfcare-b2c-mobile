import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SatisfactionFormPage } from './satisfaction-form.page';

describe('SatisfactionFormPage', () => {
  let component: SatisfactionFormPage;
  let fixture: ComponentFixture<SatisfactionFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SatisfactionFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SatisfactionFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
