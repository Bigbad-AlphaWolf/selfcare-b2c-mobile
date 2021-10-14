import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog} from '@angular/material/dialog';
import {UrlSerializer} from '@angular/router';
import {HTTP} from '@ionic-native/http/ngx';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {ModalController} from '@ionic/angular';

import {OffreServiceCardComponent} from './offre-service-card.component';

describe('OffreServiceCardComponent', () => {
  let component: OffreServiceCardComponent;
  let fixture: ComponentFixture<OffreServiceCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: Location,
            useValue: {}
          },
          {
            provide: MatDialog,
            useValue: {}
          },
          {
            provide: HttpClient,
            useValue: {}
          },
          {
            provide: ModalController,
            useValue: {}
          },
          {
            provide: MatBottomSheet,
            useValue: {}
          },
          {
            provide: InAppBrowser,
            useValue: {}
          },
          {
            provide: HTTP,
            useValue: {}
          },
          {
            provide: UrlSerializer,
            useValue: {}
          }
        ],
        declarations: [OffreServiceCardComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OffreServiceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
