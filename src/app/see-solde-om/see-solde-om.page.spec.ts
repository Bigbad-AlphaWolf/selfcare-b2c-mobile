import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeSoldeOmPage } from './see-solde-om.page';

describe('SeeSoldeOmPage', () => {
  let component: SeeSoldeOmPage;
  let fixture: ComponentFixture<SeeSoldeOmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeSoldeOmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeSoldeOmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
