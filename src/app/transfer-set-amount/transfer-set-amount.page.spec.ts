import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { TransferSetAmountPage } from './transfer-set-amount.page';

describe('TransferSetAmountPage', () => {
  let component: TransferSetAmountPage;
  let fixture: ComponentFixture<TransferSetAmountPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, ReactiveFormsModule],
        declarations: [TransferSetAmountPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: HttpClient, useValue: {} },
          { provide: FormBuilder, useValue: {} },
          { provide: UrlSerializer, useValue: {} },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferSetAmountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
