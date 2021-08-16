import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SargalCataloguePage } from './sargal-catalogue.page';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';
import { MatMenuModule } from '@angular/material';

describe('SargalCataloguePage', () => {
  let component: SargalCataloguePage;
  let fixture: ComponentFixture<SargalCataloguePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SargalCataloguePage, FormatCurrencyPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [MatMenuModule],
      providers: [
        { provide: Router },
        { provide: ActivatedRoute },
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
    fixture = TestBed.createComponent(SargalCataloguePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
