import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsConsoPage } from './details-conso.page';

describe('DetailsConsoPage', () => {
  let component: DetailsConsoPage;
  let fixture: ComponentFixture<DetailsConsoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsConsoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsConsoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
