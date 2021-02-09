import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import {
  OPERATION_TYPE_MERCHANT_PAYMENT,
  OPERATION_TYPE_SEDDO_CREDIT,
  OPERATION_TYPE_SEDDO_BONUS,
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TRANSFER_OM,
  OPERATION_TRANSFER_OM_WITH_CODE,
  REGEX_IS_DIGIT,
} from 'src/shared';
import {
  FeeModel,
  ORANGE_MONEY_TRANSFER_FEES,
} from '../services/orange-money-service';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { NavController } from '@ionic/angular';
import { OperationExtras } from '../models/operation-extras.model';
import { FeesService } from '../services/fees/fees.service';
import { OM_LABEL_SERVICES } from '../utils/bills.util';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-purchase-set-amount',
  templateUrl: './purchase-set-amount.page.html',
  styleUrls: ['./purchase-set-amount.page.scss'],
})
export class PurchaseSetAmountPage implements OnInit {
  static ROUTE_PATH: string = '/purchase-set-amount';
  title: string;
  subtitle: string;
  setAmountForm: FormGroup;
  includeFees: boolean;
  purchaseType: string;
  checkingAmount: boolean;
  recipientFirstname: string;
  recipientLastname: string;
  purchasePayload: OperationExtras;
  hasError: boolean;
  error: string;
  fee: number;
  totalAmount: number;
  transferFeesArray: { tsc: FeeModel[], tac: FeeModel[] } = {tac: [], tsc: []};
  userHasNoOmAccount: boolean; // tell if recipient has OM account or not
  OPERATION_TYPE_MERCHANT_PAYMENT = OPERATION_TYPE_MERCHANT_PAYMENT;
  OPERATION_TYPE_SEDDO_CREDIT = OPERATION_TYPE_SEDDO_CREDIT;
  OPERATION_TYPE_SEDDO_BONUS = OPERATION_TYPE_SEDDO_BONUS;
  OPERATION_TYPE_RECHARGE_CREDIT = OPERATION_TYPE_RECHARGE_CREDIT;
  OPERATION_TRANSFER_OM = OPERATION_TRANSFER_OM;
  OPERATION_TRANSFER_OM_WITH_CODE = OPERATION_TRANSFER_OM_WITH_CODE;
  isLoadingFees: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private omService: OrangeMoneyService,
    private navController: NavController,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private feeService: FeesService
    ) {}

  ngOnInit() {
    this.initForm(100);
    this.getPurchaseType();
  }

  amountSelected($event) {}

  initForm(minValue: number, initialValue?: number) {
    this.setAmountForm = this.fb.group({
      amount: [initialValue, [Validators.required, Validators.min(minValue)]],
    });
  }

  initTransferWithCodeForm(initialValue?: number) {
    this.setAmountForm = this.fb.group({
      amount: [initialValue, [Validators.required, Validators.min(1)]],
      recipientFirstname: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('[a-zA-Z ]*'),
        ],
      ],
      recipientLastname: [
        '',
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
        this.subtitle = 'Montant à payer';
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

  async getPurchaseType() {
    // let state = this.router.getCurrentNavigation().extras.state;
    const isDeeplinkTransferOM = await this.checkTransferOMDeeplink();
    if (isDeeplinkTransferOM) return;
    this.purchasePayload = history.state;
    if (this.purchasePayload && this.purchasePayload.purchaseType) {
      this.purchaseType = this.purchasePayload.purchaseType;
      this.userHasNoOmAccount = this.purchasePayload.userHasNoOmAccount;
      const initialAmount = this.purchasePayload.amount;
      this.recipientFirstname = this.purchasePayload.recipientFirstname;
      this.recipientLastname = this.purchasePayload.recipientLastname;
      this.getPageTitle();

      switch (this.purchaseType) {
        case OPERATION_TYPE_SEDDO_CREDIT:
        case OPERATION_TYPE_SEDDO_BONUS:
          this.initForm(100);
          break;
        case OPERATION_TYPE_MERCHANT_PAYMENT:
          this.initForm(1, initialAmount);
          break;
        case OPERATION_TRANSFER_OM:
          this.getOMTransferFees(OM_LABEL_SERVICES.TRANSFERT_SANS_CODE).subscribe()
          this.initForm(1, initialAmount);
          break;
        case OPERATION_TRANSFER_OM_WITH_CODE:
          this.getOMTransferFees(OM_LABEL_SERVICES.TRANSFERT_AVEC_CODE).subscribe()
          this.initTransferWithCodeForm(initialAmount);
          break;
        default:
          break;
      }
    }
  }

  async checkTransferOMDeeplink() {
    const msisdn = this.route.snapshot.paramMap.get('msisdn');
    if (msisdn) {
      this.purchasePayload = {
        recipientMsisdn: msisdn,
        recipientFirstname: '',
        recipientLastname: '',
      };
      const msisdnHasOM = await this.omService
        .checkUserHasAccount(msisdn)
        .toPromise();
      this.purchaseType = msisdnHasOM
        ? OPERATION_TRANSFER_OM
        : OPERATION_TRANSFER_OM_WITH_CODE;
      this.userHasNoOmAccount = !msisdnHasOM;
      this.userHasNoOmAccount
        ? this.initTransferWithCodeForm()
        : this.initForm(1);
      this.getPageTitle();
      this.ref.detectChanges();
      return 1;
    }
    return 0;
  }

  goBack() {
    switch (this.purchaseType) {
      case OPERATION_TYPE_SEDDO_CREDIT:
      case OPERATION_TYPE_SEDDO_BONUS:
      case OPERATION_TRANSFER_OM:
      case OPERATION_TRANSFER_OM_WITH_CODE:
        this.navController.pop();
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
    this.purchasePayload.includeFee = this.includeFees;
    this.purchasePayload.fee = this.fee;
    this.purchasePayload.purchaseType = this.purchaseType;
    if (this.purchaseType === OPERATION_TRANSFER_OM_WITH_CODE) {
      this.purchasePayload.recipientFirstname = this.setAmountForm.value[
        'recipientFirstname'
      ];
      this.purchasePayload.recipientLastname = this.setAmountForm.value[
        'recipientLastname'
      ];
    }
    this.checkOMBalanceSuffiency(amount);
  }

  checkOMBalanceSuffiency(amount) {
    this.checkingAmount = true;
    this.omService.checkBalanceSufficiency(amount).subscribe(
      (hasEnoughBalance) => {
        this.checkingAmount = false;
        if (hasEnoughBalance) {
          this.redirectRecapPage(this.purchasePayload);
        } else {
          this.error =
            'Le montant que vous voulez transférer est supérieur à votre solde.';
        }
      },
      (err) => {
        this.checkingAmount = false;
        this.redirectRecapPage(this.purchasePayload);
      }
    );
  }

  redirectRecapPage(payload: any) {
    const navExtras: NavigationExtras = { state: payload };
    this.navController.navigateForward(['/operation-recap'], navExtras);
    // this.router.navigate(['/operation-recap'], navExtras);
  }

  getOMTransferFees(om_service: string) {
    this.hasError = false;
    this.isLoadingFees = true;
    return this.feeService.getFeesByOMService(om_service, this.purchasePayload.recipientMsisdn).pipe(
      tap((fees: FeeModel[]) => {
        this.isLoadingFees = false;
        this.transferFeesArray[om_service] = fees;
        if(!fees.length) {
          this.hasError = true;
        }
      }), catchError((err: any) => {
        this.hasError = true;
        this.isLoadingFees = false;
        return of(err)
      })
    );
  }


  toggleTransferWithCode(event, amountInputValue) {
    const checked = event.detail.checked;
    const amount = +amountInputValue;

    if (checked) {
      this.initTransferWithCodeForm(amount);
      this.purchaseType = OPERATION_TRANSFER_OM_WITH_CODE;
      if (!this.transferFeesArray[OM_LABEL_SERVICES.TRANSFERT_AVEC_CODE].length) {
        this.getOMTransferFees(OM_LABEL_SERVICES.TRANSFERT_AVEC_CODE).subscribe( _ => {
          this.toggleTransferWithCode(event, amountInputValue)
        })
      }
    } else {
      this.initForm(1, amount);
      this.purchaseType = OPERATION_TRANSFER_OM;
    }
    this.getCurrentFee(amount);
  }

  handleFees(event, amountInputValue) {
    const amount = +amountInputValue;
    this.includeFees = event.detail.checked;
    this.includeFees
      ? (this.totalAmount = amount + this.fee)
      : (this.totalAmount = amount);

  }

  getCurrentFee(amount) {
    this.error = null;
     if (amount && this.purchaseType === OPERATION_TRANSFER_OM_WITH_CODE) {
       const feeInfo= this.feeService.extractFees(this.transferFeesArray[OM_LABEL_SERVICES.TRANSFERT_AVEC_CODE], amount);
       if(!feeInfo.effective_fees) {
        this.error = "Le montant que vous avez saisi n'est pas dans la plage autorisé";
        return
       }
       this.fee = feeInfo.effective_fees;
     }
     if (amount && this.purchaseType === OPERATION_TRANSFER_OM) {
       const fees = this.feeService.extractFees(this.transferFeesArray[OM_LABEL_SERVICES.TRANSFERT_SANS_CODE], amount);
       if(!fees.effective_fees) {
        this.error = "Le montant que vous avez saisi n'est pas dans la plage autorisé";
        return
       }
       this.fee = fees.effective_fees;
     }
  }

  onAmountChanged(event: any) {
     const amount = event.target.value;
     this.totalAmount = +amount;
     this.updateInput(event);
     this.error = null;
     if (this.purchaseType === OPERATION_TRANSFER_OM_WITH_CODE) {
       const fee = this.feeService.extractFees(this.transferFeesArray[OM_LABEL_SERVICES.TRANSFERT_AVEC_CODE], amount);
       if(!fee.effective_fees) {
        this.error = "Le montant que vous avez saisi n'est pas dans la plage autorisé";
        return
       }
       this.fee = fee.effective_fees;
       this.totalAmount += this.fee;
     }
    if (this.purchaseType === OPERATION_TRANSFER_OM) {
      const fee = this.feeService.extractFees(this.transferFeesArray[OM_LABEL_SERVICES.TRANSFERT_SANS_CODE], amount);
      if(!fee.effective_fees) {
        this.error = "Le montant que vous avez saisi n'est pas dans la plage autorisé";
        return
       }
      this.fee = fee.effective_fees;
      this.includeFees
        ? (this.totalAmount += this.fee)
        : (this.totalAmount = amount);
    }
  }

  updateInput(eventInput: any) {
    if (!REGEX_IS_DIGIT.test(eventInput.data)) {
      const value = eventInput.target.value;
      eventInput.target.value = 0;
      eventInput.target.value = value;
    }
  }
}
