import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {AproposPage} from './apropos.page';
import {MatDialogModule} from '@angular/material/dialog';
import {Platform} from '@ionic/angular';
import {Router} from '@angular/router';
import {Deeplinks} from '@ionic-native/deeplinks/ngx';
import {AppVersion} from '@ionic-native/app-version/ngx';
import {File} from '@ionic-native/file/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserModule} from '@angular/platform-browser';

describe('AproposPage', () => {
  let component: AproposPage;
  let fixture: ComponentFixture<AproposPage>;
  let promiseMock, AppVersionSppy, platformReadySpy, platformSpy;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AproposPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [MatDialogModule, BrowserModule, RouterTestingModule],
        providers: [
          {provide: Platform, useValue: {}},
          {provide: Deeplinks},
          {
            provide: AppVersion,
            useValue: {
              getVersionNumber: () => {
                return Promise.resolve();
              }
            }
          },
          {
            provide: FileOpener,
            useValue: {}
          },
          {
            provide: File,
            useValue: {}
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AproposPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
