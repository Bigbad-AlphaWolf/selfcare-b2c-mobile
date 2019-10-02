import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFormulePage } from './my-formule.page';

describe('MyFormulePage', () => {
  let component: MyFormulePage;
  let fixture: ComponentFixture<MyFormulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFormulePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFormulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
