import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsHubPage } from './bills-hub.page';

describe('BillsHubPage', () => {
  let component: BillsHubPage;
  let fixture: ComponentFixture<BillsHubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillsHubPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
