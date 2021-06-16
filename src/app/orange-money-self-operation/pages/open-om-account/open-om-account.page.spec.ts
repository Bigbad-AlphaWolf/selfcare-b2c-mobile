import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenOmAccountPage } from './open-om-account.page';

describe('OpenOmAccountPage', () => {
  let component: OpenOmAccountPage;
  let fixture: ComponentFixture<OpenOmAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenOmAccountPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenOmAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
