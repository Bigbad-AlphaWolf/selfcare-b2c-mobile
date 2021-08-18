import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegistrationSuccessModalPage } from './registration-success-modal.page';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AngularDelegate, ModalController } from '@ionic/angular';

describe('RegistrationSuccessModalPage', () => {
  let component: RegistrationSuccessModalPage;
  let fixture: ComponentFixture<RegistrationSuccessModalPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [RegistrationSuccessModalPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          AngularDelegate,
          { provide: Router, useValue: {} },
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
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSuccessModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
