import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';

import { CreditPassAmountPage } from './credit-pass-amount.page';

describe('CreditPassAmountPage', () => {
  let component: CreditPassAmountPage;
  let fixture: ComponentFixture<CreditPassAmountPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CreditPassAmountPage],
        providers: [
          {
            provide: Location,
          },
          {
            provide: UrlSerializer,
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditPassAmountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
