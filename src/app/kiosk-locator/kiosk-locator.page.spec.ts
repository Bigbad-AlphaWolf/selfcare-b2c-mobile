import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskLocatorPage } from './kiosk-locator.page';

describe('KioskLocatorPage', () => {
  let component: KioskLocatorPage;
  let fixture: ComponentFixture<KioskLocatorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KioskLocatorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskLocatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
