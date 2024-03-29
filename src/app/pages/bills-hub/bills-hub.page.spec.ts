import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularDelegate, ModalController, ToastController } from '@ionic/angular';
import { off } from 'process';
import { of } from 'rxjs';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';

import { BillsHubPage } from './bills-hub.page';

describe('BillsHubPage', () => {
  let component: BillsHubPage;
  let fixture: ComponentFixture<BillsHubPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        AngularDelegate,
        {
          provide: MatBottomSheet,
        },
        {
          provide: MatDialog,
        },
        {
          provide: UrlSerializer,
        },
        {
          provide: Location,
        },
        {
          provide: ModalController,
        },
        {
          provide: ToastController,
        },
        {
          provide: OrangeMoneyService,
          useValue: {
            omAccountSession: () => {
              return of();
            },
          },
        },
        {
          provide: OperationService,
          useValue: {
            getServicesByFormule: () => {
              return of();
            },
          },
        },
        {
          provide: BottomSheetService,
          useValue: {
            initBsModal: () => {
              return of();
            },
            openModal: () => {
              return '';
            },
          },
        },
      ],
      declarations: [BillsHubPage],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
