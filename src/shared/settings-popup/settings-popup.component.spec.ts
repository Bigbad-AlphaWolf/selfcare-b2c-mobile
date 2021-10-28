import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {SettingsPopupComponent} from './settings-popup.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {OpenNativeSettings} from '@ionic-native/open-native-settings/ngx';

describe('SettingsPopupComponent', () => {
  let component: SettingsPopupComponent;
  let fixture: ComponentFixture<SettingsPopupComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SettingsPopupComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: MAT_DIALOG_DATA,
            useValue: {}
          },
          {
            provide: MatDialogRef,
            useValue: {}
          },
          {
            provide: OpenNativeSettings,
            useValue: {}
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
