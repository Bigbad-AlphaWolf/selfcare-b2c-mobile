import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransfertHubServicesPage } from './transfert-hub-services.page';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Contacts } from '@ionic-native/contacts';

describe('TransfertHubServicesPage', () => {
  let component: TransfertHubServicesPage;
  let fixture: ComponentFixture<TransfertHubServicesPage>;

  beforeEach(waitForAsync(() => {
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
