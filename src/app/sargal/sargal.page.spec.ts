import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SargalPage } from './sargal.page';

describe('SargalPage', () => {
  let component: SargalPage;
  let fixture: ComponentFixture<SargalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SargalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SargalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
