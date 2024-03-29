import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { MatDialogModule } from '@angular/material/dialog';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { UrlSerializer } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Location } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let statusBarSpy, splashScreenSpy, platformReadySpy, platformSpy;

  beforeEach(waitForAsync(() => {
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', {
      ready: platformReadySpy,
      backButton: () => {
        return {
          subscribeWithPriority: () => {
            return '';
          },
        };
      },
    });

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatDialogModule, BrowserModule, RouterTestingModule],
      providers: [
        {
          provide: StatusBar,
          useValue: {
            overlaysWebView: () => {},
            styleDefault: () => {},
          },
        },
        { provide: SplashScreen, useValue: splashScreenSpy },
        Platform,
        { provide: AndroidPermissions },
        { provide: Location },
        { provide: UrlSerializer },
        {
          provide: Uid,
        },
        {
          provide: HttpClient,
          useValue: {},
        },
        {
          provide: AppVersion,
          useValue: {
            getVersionNumber: () => {
              return of().toPromise();
            },
          },
        },
        {
          provide: AppMinimize,
          useValue: {},
        },
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  // it('should initialize the app', async () => {
  //   TestBed.createComponent(AppComponent);
  //   expect(platformSpy.ready).toHaveBeenCalled();
  //   await platformReadySpy;
  //   expect(statusBarSpy.styleDefault).toHaveBeenCalled();
  //   expect(splashScreenSpy.hide).toHaveBeenCalled();
  // });
});
