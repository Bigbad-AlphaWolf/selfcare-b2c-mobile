import {Overlay} from '@angular/cdk/overlay';
import {Location} from '@angular/common';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {UrlSerializer} from '@angular/router';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {AngularDelegate, ModalController} from '@ionic/angular';

import {BanniereComponent} from './banniere.component';

describe('BanniereComponent', () => {
  let component: BanniereComponent;
  let fixture: ComponentFixture<BanniereComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatDialogModule],
        providers: [
          {
            provide: Location
          },
          {
            provide: MatDialog
          },
          {
            provide: HttpClient
          },
          {
            provide: Location
          },
          {
            provide: ModalController
          },
          {
            provide: MatBottomSheet
          },
          {
            provide: UrlSerializer
          },
          {
            provide: InAppBrowser
          },
          {
            provide: Overlay
          },
          {
            provide: AngularDelegate
          },
          {
            provide: HttpHandler
          }
        ],
        declarations: [BanniereComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BanniereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
