import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { ImageService } from 'src/app/services/image-service/image.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { PhoneNumberDisplayPipe } from 'src/shared/pipes/phone-number-display.pipe';

import { CancelTransactionOmPage } from './cancel-transaction-om.page';

describe('CancelTransactionOmPage', () => {
  let component: CancelTransactionOmPage;
  let fixture: ComponentFixture<CancelTransactionOmPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CancelTransactionOmPage, PhoneNumberDisplayPipe],
        providers: [
          {
            provide: Location,
          },
          {
            provide: ModalController,
          },
          {
            provide: OrangeMoneyService,
            useValue: {
              getOmMsisdn: () => {
                return of();
              },
              sendInfosCancelationTransfertOM: () => {
                return of();
              },
            },
          },
          {
            provide: DashboardService,
            useValue: {
              getCustomerInformations: () => {
                return of();
              },
            },
          },
          {
            provide: ImageService,
            useValue: {
              convertBase64ToBlob: () => {
                return of().toPromise();
              },
            },
          },
          {
            provide: UrlSerializer,
          },
        ],
        imports: [
          ReactiveFormsModule,
          FormsModule,
          RouterTestingModule,
          IonicModule,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelTransactionOmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
