import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AproposPage } from './apropos.page';
import { MatDialogModule } from '@angular/material';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import {
  FileTransferObject,
  FileTransfer,
} from '@ionic-native/file-transfer/ngx';

describe('AproposPage', () => {
  let component: AproposPage;
  let fixture: ComponentFixture<AproposPage>;
  let promiseMock, AppVersionSppy, platformReadySpy, platformSpy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AproposPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatDialogModule],
      providers: [
        { provide: Platform, useValue: {} },
        { provide: Router },
        { provide: Deeplinks },
        {
          provide: AppVersion,
          useValue: {
            getVersionNumber:() => {
              return Promise.resolve()
            }
          },
        },
        {
          provide: FileTransfer,
          useValue: {
            create:() => {},
            download:() => {
              return Promise.resolve()
            }
          },
        },
        {
          provide: FileOpener,
          useValue: {},
        },
        {
          provide: File,
          useValue: {},
        },
      ],
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
