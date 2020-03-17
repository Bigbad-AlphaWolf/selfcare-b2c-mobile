import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AproposPage } from './apropos.page';
import { MatDialogModule } from '@angular/material';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { HttpClient } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import {
  FileTransferObject,
  FileTransfer
} from '@ionic-native/file-transfer/ngx';

describe('AproposPage', () => {
  let component: AproposPage;
  let fixture: ComponentFixture<AproposPage>;
  let promiseMock, AppVersionSppy, platformReadySpy, platformSpy;
  beforeEach(async(() => {
    promiseMock = Promise.resolve();
    AppVersionSppy = jasmine.createSpyObj('AppVersion', { getVersionNumber: promiseMock });
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy , is: platformReadySpy});
    TestBed.configureTestingModule({
      declarations: [AproposPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatDialogModule],
      providers: [
        { provide: Platform, useValue: platformSpy },
        { provide: Router },
        { provide: Deeplinks },
        {
          provide: AppVersion,
          useClass: AppVersionSppy
        },
        {
          provide: FileTransfer,
          useValue: {}
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AproposPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
