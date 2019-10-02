import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SargalCataloguePage } from './sargal-catalogue.page';

describe('SargalCataloguePage', () => {
  let component: SargalCataloguePage;
  let fixture: ComponentFixture<SargalCataloguePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SargalCataloguePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SargalCataloguePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
