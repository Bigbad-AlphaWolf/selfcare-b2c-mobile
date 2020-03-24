import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistancePage } from './assistance.page';
import { MatDialogModule } from '@angular/material';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version/ngx';

describe('AssistancePage', () => {
  let component: AssistancePage;
  let fixture: ComponentFixture<AssistancePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistancePage ],
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
    fixture = TestBed.createComponent(AssistancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
