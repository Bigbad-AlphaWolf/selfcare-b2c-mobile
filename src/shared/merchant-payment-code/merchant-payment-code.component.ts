import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { ApplicationRoutingService } from 'src/app/services/application-routing/application-routing.service';

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
    private applicationRoutingService: ApplicationRoutingService
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
    this.orangeMoneyService.checkMerchantCode(code).subscribe(
      (merchant) => {
        this.chekingMerchant = false;
        this.applicationRoutingService.goSetAmountPage('MERCHANT_PAYMENT');
      },
      (err) => {
        this.chekingMerchant = false;
        this.hasErrorOnCheckMerchant = true;
        this.errorMsg = err.msg ? err.msg : 'Une erreur est survenue';
      }
    );
  }
}
