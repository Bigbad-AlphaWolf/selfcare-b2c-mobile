import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantPaymentCodeComponent } from './merchant-payment-code.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { AcronymPipe } from '../pipes/acronym.pipe';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('MerchantPaymentCodeComponent', () => {
  let component: MerchantPaymentCodeComponent;
  let fixture: ComponentFixture<MerchantPaymentCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [MerchantPaymentCodeComponent, AcronymPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        AngularDelegate,
        {
          provide: OrangeMoneyService,
          useValue: {
            getMerchantByCode: () => {
              return of();
            },
          },
        },
        {
          provide: ModalController,
        },
        {
          provide: ChangeDetectorRef,
          useValue: {
            detectChanges: () => {},
          },
        },
        {
          provide: BottomSheetService,
          useValue: {
            openModal: () => {},
          },
        },
        {
          provide: RecentsService,
          useValue: {
            fetchRecents: () => {
              return of();
            },
          },
        },
        FormBuilder,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantPaymentCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
