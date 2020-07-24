import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPassVoyagePage } from './list-pass-voyage.page';

describe('ListPassVoyagePage', () => {
  let component: ListPassVoyagePage;
  let fixture: ComponentFixture<ListPassVoyagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPassVoyagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPassVoyagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
