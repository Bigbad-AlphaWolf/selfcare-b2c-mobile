import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactIbouHubPage } from './contact-ibou-hub.page';

describe('ContactIbouHubPage', () => {
  let component: ContactIbouHubPage;
  let fixture: ComponentFixture<ContactIbouHubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactIbouHubPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactIbouHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
