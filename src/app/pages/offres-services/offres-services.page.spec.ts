import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffresServicesPage } from './offres-services.page';

describe('OffresServicesPage', () => {
  let component: OffresServicesPage;
  let fixture: ComponentFixture<OffresServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffresServicesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffresServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
