import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinPadComponent } from './pin-pad.component';
import { MatDialogModule } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version/ngx';

describe('PinPadComponent', () => {
  let component: PinPadComponent;
  let fixture: ComponentFixture<PinPadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinPadComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatDialogModule],
      providers: [
        { provide: Router },
        {
          provide: HttpClient,
          useValue: {}
        },
        {
          provide: AppVersion,
          useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
