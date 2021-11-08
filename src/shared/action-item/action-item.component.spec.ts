import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularDelegate, ModalController } from '@ionic/angular';

import { ActionItemComponent } from './action-item.component';

describe('ActionItemComponent', () => {
  let component: ActionItemComponent;
  let fixture: ComponentFixture<ActionItemComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ActionItemComponent],
        imports: [
          RouterTestingModule,
          BrowserModule,
          OverlayModule,
          MatDialogModule,
        ],
        providers: [
          {
            provide: ModalController,
          },
          {
            provide: AngularDelegate,
          },
          {
            provide: MatBottomSheet,
          },
          {
            provide: HttpClient,
          },
          {
            provide: HttpHandler,
          },
          {
            provide: InAppBrowser,
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
