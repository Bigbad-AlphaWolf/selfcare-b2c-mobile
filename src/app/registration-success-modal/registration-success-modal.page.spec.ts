import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSuccessModalPage } from './registration-success-modal.page';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ModalController } from '@ionic/angular';

describe('RegistrationSuccessModalPage', () => {
  let component: RegistrationSuccessModalPage;
  let fixture: ComponentFixture<RegistrationSuccessModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationSuccessModalPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router },
        { provide: ModalController },
        {
          provide: HttpClient,
          useValue: {
            post() {
              return of();
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSuccessModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});