import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrangeBillsPage } from './orange-bills.page';

describe('OrangeBillsPage', () => {
  let component: OrangeBillsPage;
  let fixture: ComponentFixture<OrangeBillsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrangeBillsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrangeBillsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
