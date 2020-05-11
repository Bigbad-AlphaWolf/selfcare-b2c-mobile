import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertOmHubServicesPage } from './transfert-om-hub-services.page';

describe('TransfertOmHubServicesPage', () => {
  let component: TransfertOmHubServicesPage;
  let fixture: ComponentFixture<TransfertOmHubServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfertOmHubServicesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfertOmHubServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
