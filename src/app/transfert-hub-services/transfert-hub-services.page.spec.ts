import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfertHubServicesPage } from './transfert-hub-services.page';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Contacts } from '@ionic-native/contacts';

describe('TransfertHubServicesPage', () => {
  let component: TransfertHubServicesPage;
  let fixture: ComponentFixture<TransfertHubServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransfertHubServicesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Router
        },
        {
          provide: ModalController
        },
        {
          provide: Contacts
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfertHubServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
