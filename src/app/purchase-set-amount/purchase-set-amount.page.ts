import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import {
  OPERATION_TYPE_MERCHANT_PAYMENT,
  OPERATION_TYPE_SEDDO_CREDIT,
  OPERATION_TYPE_SEDDO_BONUS,
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TRANSFER_OM,
  OPERATION_TRANSFER_OM_WITH_CODE,
} from 'src/shared';
import {
  FeeModel,
  ORANGE_MONEY_TRANSFER_FEES,
} from '../services/orange-money-service';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';

@Component({
  selector: 'app-purchase-set-amount',
  templateUrl: './purchase-set-amount.page.html',
  styleUrls: ['./purchase-set-amount.page.scss'],
})
export class PurchaseSetAmountPage implements OnInit {
  title: string;
  subtitle: string;
  setAmountForm: FormGroup;
  includeFees: boolean;
  purchaseType: string;
  checkingAmount: boolean;
  recipientHasNoOM: boolean;
  recipientFirstname: string;
  recipientLastname: string;
  purchasePayload: any;
  hasError: boolean;
  error: string;
  fee: number;
  totalAmount: number;
  transferFeesArray: FeeModel[];
  OPERATION_TYPE_MERCHANT_PAYMENT = OPERATION_TYPE_MERCHANT_PAYMENT;
  OPERATION_TYPE_SEDDO_CREDIT = OPERATION_TYPE_SEDDO_CREDIT;
  OPERATION_TYPE_SEDDO_BONUS = OPERATION_TYPE_SEDDO_BONUS;
  OPERATION_TYPE_RECHARGE_CREDIT = OPERATION_TYPE_RECHARGE_CREDIT;
  OPERATION_TRANSFER_OM = OPERATION_TRANSFER_OM;
  OPERATION_TRANSFER_OM_WITH_CODE = OPERATION_TRANSFER_OM_WITH_CODE;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private omService: OrangeMoneyService
  ) {}

  ngOnInit() {
    this.getPurchaseType();
  }

  initForm(minValue: number, initialValue?: number) {
    this.setAmountForm = this.fb.group({
      amount: [initialValue, [Validators.required, Validators.min(minValue)]],
    });
  }

  initTransferWithCodeForm(initialValue?: number) {
    this.setAmountForm = this.fb.group({
      amount: [initialValue, [Validators.required, Validators.min(1)]],
      recipientFirstname: [
        this.recipientFirstname,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('[a-zA-Z ]*'),
        ],
      ],
      recipientLastname: [
        this.recipientLastname,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('[a-zA-Z ]*'),
        ],
      ],
    });
  }

  getPageTitle() {
    this.subtitle = 'Montant à transférer';
    switch (this.purchaseType) {
      case OPERATION_TYPE_SEDDO_CREDIT:
        this.title = 'Transfert de Crédit';
        break;
      case OPERATION_TYPE_SEDDO_BONUS:
        this.title = 'Transfert de Bonus';
        break;
      case OPERATION_TYPE_MERCHANT_PAYMENT:
        this.title = 'Paiement marchand';
        break;
      case OPERATION_TYPE_RECHARGE_CREDIT:
        this.title = 'Achat de Crédit';
        this.subtitle = 'Montant à recharger';
        break;
      case OPERATION_TRANSFER_OM:
      case OPERATION_TRANSFER_OM_WITH_CODE:
        this.title = "Transfert d'argent";
        this.getOMTransferFees();
        break;
      default:
        break;
    }
  }

  getPurchaseType() {
    this.route.queryParams.subscribe(() => {
      this.purchasePayload = this.router.getCurrentNavigation().extras.state;
      console.log(this.router.getCurrentNavigation().extras.state);
      if (this.purchasePayload && this.purchasePayload.purchaseType) {
        this.purchaseType = this.purchasePayload.purchaseType;
        this.getPageTitle();
        switch (this.purchaseType) {
          case OPERATION_TYPE_SEDDO_CREDIT:
          case OPERATION_TYPE_SEDDO_BONUS:
            this.initForm(100);
            break;
          case OPERATION_TYPE_MERCHANT_PAYMENT:
          case OPERATION_TYPE_RECHARGE_CREDIT:
          case OPERATION_TRANSFER_OM:
            this.initForm(1);
            break;
          case OPERATION_TRANSFER_OM_WITH_CODE:
            this.recipientHasNoOM = true;
            this.initTransferWithCodeForm();
            break;
          default:
            break;
        }
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  getPurchaseData() {
    switch (this.purchaseType) {
      case OPERATION_TYPE_MERCHANT_PAYMENT:
        break;
      case OPERATION_TYPE_SEDDO_CREDIT:
      case OPERATION_TYPE_SEDDO_BONUS:
        break;
      case OPERATION_TYPE_MERCHANT_PAYMENT:
      case OPERATION_TYPE_RECHARGE_CREDIT:
      case OPERATION_TRANSFER_OM:
        break;
      case OPERATION_TRANSFER_OM_WITH_CODE:
        break;
      default:
        break;
    }
  }

  goBack() {
    switch (this.purchaseType) {
      case OPERATION_TYPE_SEDDO_CREDIT:
      case OPERATION_TYPE_SEDDO_BONUS:
      case OPERATION_TRANSFER_OM:
      case OPERATION_TRANSFER_OM_WITH_CODE:
        break;
      case OPERATION_TYPE_MERCHANT_PAYMENT:
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }

  goNext() {
    const amount = this.setAmountForm.value['amount'];
    this.purchasePayload.amount = amount;
    const navExtras: NavigationExtras = { state: this.purchasePayload };
    this.router.navigate(['/operation-recap'], navExtras);
  }

  getOMTransferFees() {
    this.omService.getTransferFees().subscribe(
      (fees: FeeModel[]) => {
        this.transferFeesArray = fees;
      },
      (err) => {
        this.transferFeesArray = ORANGE_MONEY_TRANSFER_FEES;
      }
    );
  }

  extractFees(
    fees: FeeModel[],
    amount: number
  ): { without_code: number; with_code: number } {
    const result: { without_code: number; with_code: number } = {
      without_code: null,
      with_code: null,
    };
    for (let fee of fees) {
      if (amount >= +fee.minimum && amount <= +fee.maximum) {
        result.without_code = fee.withoutCode;
        result.with_code = fee.withCode;
        return result;
      }
    }
  }

  toggleTransferWithCode(event, amountInputValue) {
    const checked = event.detail.checked;
    const amount = +amountInputValue;
    if (checked) {
      this.initTransferWithCodeForm(amount);
      this.purchaseType = OPERATION_TRANSFER_OM_WITH_CODE;
      this.getCurrentFee(amount);
    } else {
      this.initForm(1, amount);
      this.purchaseType = OPERATION_TRANSFER_OM;
      this.getCurrentFee(amount);
    }
  }

  handleFees(event) {
    this.includeFees = event.detail.checked;
    this.includeFees
      ? (this.totalAmount = +this.totalAmount + this.fee)
      : (this.totalAmount = +this.totalAmount - this.fee);
  }

  getCurrentFee(amount) {
    if (this.purchaseType === OPERATION_TRANSFER_OM_WITH_CODE) {
      const fee = this.extractFees(this.transferFeesArray, amount);
      this.fee = fee.with_code;
      this.totalAmount = +amount + this.fee;
    }
    if (this.purchaseType === OPERATION_TRANSFER_OM) {
      const fee = this.extractFees(this.transferFeesArray, amount);
      this.fee = fee.without_code;
      this.includeFees
        ? (this.totalAmount = +amount + this.fee)
        : (this.totalAmount = +amount);
    }
  }

  onAmountChanged(amount) {
    this.totalAmount = +amount;
    if (this.purchaseType === OPERATION_TRANSFER_OM_WITH_CODE) {
      const fee = this.extractFees(this.transferFeesArray, amount);
      this.fee = fee.with_code;
      this.totalAmount += this.fee;
    }
    if (this.purchaseType === OPERATION_TRANSFER_OM) {
      const fee = this.extractFees(this.transferFeesArray, amount);
      this.fee = fee.without_code;
      this.includeFees
        ? (this.totalAmount += this.fee)
        : (this.totalAmount = amount);
    }
  }
}
