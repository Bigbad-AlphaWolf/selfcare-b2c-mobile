import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { ApplicationRoutingService } from 'src/app/services/application-routing/application-routing.service';
import { MatBottomSheet } from '@angular/material';
import { OPERATION_TYPE_MERCHANT_PAYMENT } from '..';
import { ModalController } from '@ionic/angular';
import { retryWhen, switchMap } from 'rxjs/operators';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

@Component({
  selector: 'app-merchant-payment-code',
  templateUrl: './merchant-payment-code.component.html',
  styleUrls: ['./merchant-payment-code.component.scss'],
})
export class MerchantPaymentCodeComponent implements OnInit {
  chekingMerchant: boolean;
  merchantCodeForm: FormGroup;
  hasErrorOnCheckMerchant: boolean;
  errorMsg: string;

  constructor(
    private fb: FormBuilder,
    private orangeMoneyService: OrangeMoneyService,
    private applicationRoutingService: ApplicationRoutingService,
    private bottomSheet: MatBottomSheet,
    private modalController: ModalController,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.merchantCodeForm = this.fb.group({
      merchantCode: ['', [Validators.required]],
    });
  }

  checkMerchant() {
    this.hasErrorOnCheckMerchant = false;
    this.chekingMerchant = true;
    const code = this.merchantCodeForm.value.merchantCode;
    this.orangeMoneyService
      .getMerchantByCode(code)
      .pipe(
        retryWhen((err) => {
          return err.pipe(
            switchMap(async (err) => {
              if (err.status === 401) return await this.resetOmToken(err);
              throw err;
            })
          );
        })
      )
      .subscribe(
        (response: any) => {
          this.chekingMerchant = false;
          const payload = {
            purchaseType: OPERATION_TYPE_MERCHANT_PAYMENT,
            merchantCode: code,
            merchantName: response.content.data.nom_marchand,
          };
          if (
            response &&
            response.status_code &&
            (response.status_code.match('Success') ||
              response.status_code.match('Erreur-601'))
          ) {
            this.applicationRoutingService.goSetAmountPage(payload);
            this.modalController.dismiss();
          } else {
            this.onCheckingMerchantError(response.status_wording);
          }
        },
        (err) => {
          this.chekingMerchant = false;
          if (err.error.name) return;
          err && err.msg
            ? this.onCheckingMerchantError(err.msg)
            : this.onCheckingMerchantError();
        }
      );
  }

  async resetOmToken(err) {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: null,
      },
    });
    await modal.present();
    let result = await modal.onDidDismiss();
    if (result && result.data && result.data.success) return of(err);
    throw new HttpErrorResponse({
      error: { title: 'Pinpad cancled', name: 'pinpadDismissed' },
      status: 401,
    });
  }

  onCheckingMerchantError(msg?: string) {
    this.hasErrorOnCheckMerchant = true;
    this.errorMsg = msg ? msg : 'Une erreur est survenue';
    this.ref.detectChanges();
  }
}
