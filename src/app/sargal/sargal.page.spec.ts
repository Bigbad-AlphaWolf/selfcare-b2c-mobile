import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SargalPage } from './sargal.page';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('SargalPage', () => {
  let component: SargalPage;
  let fixture: ComponentFixture<SargalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SargalPage, FormatCurrencyPipe],
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
    fixture = TestBed.createComponent(SargalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
