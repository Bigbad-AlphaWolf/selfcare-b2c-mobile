import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDeplafonnementOmPage } from './new-deplafonnement-om.page';

describe('NewDeplafonnementOmPage', () => {
  let component: NewDeplafonnementOmPage;
  let fixture: ComponentFixture<NewDeplafonnementOmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDeplafonnementOmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDeplafonnementOmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
