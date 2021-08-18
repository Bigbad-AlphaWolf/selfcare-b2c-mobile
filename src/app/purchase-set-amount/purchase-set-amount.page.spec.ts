import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PurchaseSetAmountPage } from './purchase-set-amount.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('PurchaseSetAmountPage', () => {
  let component: PurchaseSetAmountPage;
  let fixture: ComponentFixture<PurchaseSetAmountPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PurchaseSetAmountPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [ReactiveFormsModule, RouterTestingModule],
        providers: [
          { provide: HttpHandler },
          { provide: ActivatedRoute, useValue: {} },
          { provide: HttpClient },
          { provide: Location },
          { provide: UrlSerializer },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseSetAmountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
