import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseSetAmountPage } from './purchase-set-amount.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

describe('PurchaseSetAmountPage', () => {
  let component: PurchaseSetAmountPage;
  let fixture: ComponentFixture<PurchaseSetAmountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseSetAmountPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ActivatedRoute },
        { provide: Router },
        { provide: HttpClient },
        { provide: Location },
        { provide: UrlSerializer },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseSetAmountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
