import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KioskLocatorPage } from './kiosk-locator.page';

describe('KioskLocatorPage', () => {
  let component: KioskLocatorPage;
  let fixture: ComponentFixture<KioskLocatorPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [KioskLocatorPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [],
        providers: [Geolocation, { provide: Geolocation, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskLocatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
