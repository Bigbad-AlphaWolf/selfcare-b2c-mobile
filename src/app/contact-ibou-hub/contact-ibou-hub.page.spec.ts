import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { ContactIbouHubPage } from './contact-ibou-hub.page';

describe('ContactIbouHubPage', () => {
  let component: ContactIbouHubPage;
  let fixture: ComponentFixture<ContactIbouHubPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: InAppBrowser,
            useValue: {},
          },
          {
            provide: HttpClient,
            useValue: {},
          },
          {
            provide: UrlSerializer,
            useValue: {},
          },
          {
            provide: Location,
            useValue: {},
          },
        ],
        declarations: [ContactIbouHubPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactIbouHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
