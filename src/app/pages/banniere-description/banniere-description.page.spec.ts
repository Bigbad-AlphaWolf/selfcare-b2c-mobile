import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanniereDescriptionPage } from './banniere-description.page';

describe('BanniereDescriptionPage', () => {
  let component: BanniereDescriptionPage;
  let fixture: ComponentFixture<BanniereDescriptionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanniereDescriptionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanniereDescriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
