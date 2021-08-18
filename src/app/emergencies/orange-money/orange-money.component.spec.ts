import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrangeMoneyComponent } from './orange-money.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

describe('OrangeMoneyComponent', () => {
  let component: OrangeMoneyComponent;
  let fixture: ComponentFixture<OrangeMoneyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrangeMoneyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: File, useValue: {} },
        { provide: FileOpener, useValue: {} },
        {
          provide: HttpClient,
          useValue: {
            post: () => {
              return of();
            },
            get: () => {
              return of();
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrangeMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
