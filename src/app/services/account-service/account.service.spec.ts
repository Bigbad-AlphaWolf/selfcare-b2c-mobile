import {OverlayModule} from '@angular/cdk/overlay';
import {HttpClient} from '@angular/common/http';
import {inject, TestBed} from '@angular/core/testing';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatDialog} from '@angular/material/dialog';
import {AngularDelegate, ModalController} from '@ionic/angular';
import {AccountService} from './account.service';

describe('AccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule, MatDialogModule],
      providers: [
        AngularDelegate,
        ModalController,
        {provide: HttpClient, useValue: {}},
        {provide: MatDialogRef, useValue: {}},
        {
          provide: MatDialog
        }
      ]
    });
  });

  it(
    'should be created',
    inject([AccountService], (service: AccountService) => {
      expect(service).toBeDefined();
    })
  );
});
