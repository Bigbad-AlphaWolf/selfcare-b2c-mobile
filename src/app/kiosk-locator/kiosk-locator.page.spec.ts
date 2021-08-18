import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularDelegate } from '@ionic/angular';
import { of } from 'rxjs';

import { KioskLocatorPage } from './kiosk-locator.page';

describe('KioskLocatorPage', () => {
  let component: KioskLocatorPage;
  let fixture: ComponentFixture<KioskLocatorPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [KioskLocatorPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [RouterTestingModule],
        providers: [
          AngularDelegate,
          Geolocation,
          FormBuilder,
          {
            provide: HttpClient,
            useValue: {
              get() {
                return of();
              },
            },
          },
        ],
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
