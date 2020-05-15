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
  OPERATION_TYPE_MERCHANT_PAYMENT = OPERATION_TYPE_MERCHANT_PAYMENT;
  OPERATION_TYPE_SEDDO_CREDIT = OPERATION_TYPE_SEDDO_CREDIT;
  OPERATION_TYPE_SEDDO_BONUS = OPERATION_TYPE_SEDDO_BONUS;
  OPERATION_TYPE_RECHARGE_CREDIT = OPERATION_TYPE_RECHARGE_CREDIT;
  OPERATION_TRANSFER_OM = OPERATION_TRANSFER_OM;
  OPERATION_TRANSFER_OM_WITH_CODE = OPERATION_TRANSFER_OM_WITH_CODE;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPurchaseType();
    this.title = 'Paiement Marchand';
  }

  initForm(minValue: number) {
    this.setAmountForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(minValue)]],
    });
  }

  initTransferWithCodeForm() {
    this.setAmountForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      recipientFirstname: [
        this.recipientFirstname,
        [Validators.required, Validators.minLength(3), Validators.pattern(/ /)],
      ],
      recipientLastname: [
        this.recipientLastname,
        [Validators.required, Validators.minLength(2), Validators.pattern(/ /)],
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
        break;
      default:
        break;
    }
  }

  getPurchaseType() {
    this.route.queryParams.subscribe(() => {
      this.purchasePayload = this.router.getCurrentNavigation().extras.state;
      if (this.purchasePayload && this.purchasePayload.purchaseType) {
        this.getPageTitle();
        this.purchaseType = this.purchasePayload.purchaseType;
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
}
