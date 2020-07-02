import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OemServicesPage } from './oem-services.page';

describe('OemServicesPage', () => {
  let component: OemServicesPage;
  let fixture: ComponentFixture<OemServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OemServicesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OemServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
