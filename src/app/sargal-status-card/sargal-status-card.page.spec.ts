import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SargalStatusCardPage } from './sargal-status-card.page';

describe('SargalStatusCardPage', () => {
  let component: SargalStatusCardPage;
  let fixture: ComponentFixture<SargalStatusCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SargalStatusCardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SargalStatusCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
