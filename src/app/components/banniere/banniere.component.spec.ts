import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { UrlSerializer } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';

import { BanniereComponent } from './banniere.component';

describe('BanniereComponent', () => {
  let component: BanniereComponent;
  let fixture: ComponentFixture<BanniereComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
        }
      ],
      declarations: [ BanniereComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanniereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
