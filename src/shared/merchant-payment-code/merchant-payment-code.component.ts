import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { ApplicationRoutingService } from 'src/app/services/application-routing/application-routing.service';
import { MatBottomSheet } from '@angular/material';
import { OPERATION_TYPE_MERCHANT_PAYMENT } from '..';
import { ModalController } from '@ionic/angular';

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
    this.orangeMoneyService.getMerchantByCode(code).subscribe(
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
        err && err.msg
          ? this.onCheckingMerchantError(err.msg)
          : this.onCheckingMerchantError();
      }
    );
  }

  onCheckingMerchantError(msg?: string) {
    this.chekingMerchant = false;
    this.hasErrorOnCheckMerchant = true;
    this.errorMsg = msg ? msg : 'Une erreur est survenue';
    this.ref.detectChanges();
  }
}
