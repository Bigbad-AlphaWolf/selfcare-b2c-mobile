import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatBottomSheet, MatDialog} from '@angular/material/dialog';
import {UrlSerializer} from '@angular/router';
import {ModalController} from '@ionic/angular';

import {OemOperationsComponent} from './oem-operations.component';

describe('OemOperationsComponent', () => {
  let component: OemOperationsComponent;
  let fixture: ComponentFixture<OemOperationsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: MatBottomSheet,
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
            provide: UrlSerializer,
            useValue: {}
          },
          {
            provide: Location,
            useValue: {}
          },
          {
            provide: ModalController,
            useValue: {}
          }
        ],
        declarations: [OemOperationsComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OemOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
