import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SargalStatusCardPage } from './sargal-status-card.page';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('SargalStatusCardPage', () => {
  let component: SargalStatusCardPage;
  let fixture: ComponentFixture<SargalStatusCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SargalStatusCardPage, PhoneNumberDisplayPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router },
        {
          provide: HttpClient,
          useValue: {
            get() {
              return of();
            },
            post() {
              return of();
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SargalStatusCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
