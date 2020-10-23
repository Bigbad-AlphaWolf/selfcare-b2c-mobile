import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DalalTonesPage } from './dalal-tones.page';

describe('DalalTonesPage', () => {
  let component: DalalTonesPage;
  let fixture: ComponentFixture<DalalTonesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DalalTonesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DalalTonesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
