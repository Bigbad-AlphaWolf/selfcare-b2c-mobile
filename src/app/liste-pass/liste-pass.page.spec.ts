import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePassPage } from './liste-pass.page';

describe('ListePassPage', () => {
  let component: ListePassPage;
  let fixture: ComponentFixture<ListePassPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListePassPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListePassPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
