import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GetPukCodeComponent } from './get-puk-code.component';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('GetPukCodeComponent', () => {
  let component: GetPukCodeComponent;
  let fixture: ComponentFixture<GetPukCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [GetPukCodeComponent, PhoneNumberDisplayPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
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
    fixture = TestBed.createComponent(GetPukCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
