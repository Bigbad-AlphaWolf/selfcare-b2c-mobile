import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationExtras, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { OperationExtras } from '../models/operation-extras.model';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { OM_LABEL_SERVICES } from '../utils/bills.util';
import {
  OPERATION_TRANSFER_OM,
  OPERATION_TRANSFER_OM_WITH_CODE,
  TRANSFER_OM_BALANCE_NOT_ALLOWED,
  REGEX_IS_DIGIT,
  FEES_ERROR,
  BALANCE_INSUFFICIENT_ERROR,
  IRT_TRANSFER_REASONS,
} from '../../../src/shared';
import { FeeModel } from '../services/orange-money-service';
import { FeesService } from '../services/fees/fees.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { OPERATION_TYPE_INTERNATIONAL_TRANSFER } from '../utils/operations.constants';
import { SelectElementModalComponent } from 'src/shared/select-element-modal/select-element-modal.component';

@Component({
  selector: 'app-transfer-set-amount',
  templateUrl: './transfer-set-amount.page.html',
  styleUrls: ['./transfer-set-amount.page.scss'],
})
export class TransferSetAmountPage implements OnInit {
  static ROUTE_PATH: string = '/purchase-set-amount';
  loadingFees: boolean;
  checkingAmount: boolean;
  includeFees: boolean;
  fee = 0;
  totalAmount: number = 0;
  userHasNoOmAccount: boolean; // tell if recipient has OM account or not
  hasError: boolean;
  error: string;
  hidePOPUP_FEES = true;
  purchaseType: string;
  purchasePayload: OperationExtras;
  setAmountForm: FormGroup;
  recipientFirstname: string;
  recipientLastname: string;
  OPERATION_TRANSFER_OM = OPERATION_TRANSFER_OM;
  OPERATION_TRANSFER_OM_WITH_CODE = OPERATION_TRANSFER_OM_WITH_CODE;
  FEES_ERROR = FEES_ERROR;
  sending_fees_Info: {
    effective_fees: number;
    old_fees: number;
    cashout_fees: number;
  } = {
    effective_fees: 0,
    old_fees: 0,
    cashout_fees: 0,
  };
  transferFeesArray: { retrait: FeeModel[]; tac: FeeModel[] } = {
    tac: [],
    retrait: [],
  };
  OPERATION_TYPE_INTERNATIONAL_TRANSFER = OPERATION_TYPE_INTERNATIONAL_TRANSFER;
  country: any;
  reason: any;
	loading: boolean;
  constructor(
    private route: ActivatedRoute,
    private omService: OrangeMoneyService,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private navController: NavController,
    private feeService: FeesService,
    public loadingController: LoadingController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.initFees();
  }

  async initFees() {
    const isDeeplinkTransferOM = await this.checkTransferOMDeeplink();
    if (isDeeplinkTransferOM) return;
    this.purchasePayload = history.state;
		console.log('from initFees', this.purchasePayload);

    if (this.purchasePayload && this.purchasePayload.purchaseType) {
			this.processInfosFromBeneficiaryPage();
    }
  }

  close() {
    this.hidePOPUP_FEES = true;
  }

  showInfo() {
    this.hidePOPUP_FEES = false;
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
      this.ref.detectChanges();
      return 1;
    }
    return 0;
  }

  async processInfosFromBeneficiaryPage() {
    const checkRecipient = history.state.checkRecipient;
		console.log('history.state', history.state);
    if (checkRecipient) {

			this.purchasePayload = history.state;
			this.purchaseType = this.purchasePayload.purchaseType;
			if (this.purchaseType === OPERATION_TYPE_INTERNATIONAL_TRANSFER) {
        this.initForm(1000);
        this.country = this.purchasePayload.country;
        this.getOMTransferFees(this.country?.code).subscribe();
				return;
      }
			this.getOMTransferFees(OM_LABEL_SERVICES.TRANSFERT_AVEC_CODE)
        .pipe(
          switchMap((res) => {
            return this.getOMTransferFees(OM_LABEL_SERVICES.TAF);
          })
        )
        .subscribe();
			this.loading = true;
      const msisdnHasOM = await this.omService
        .checkUserHasAccount(this.purchasePayload.recipientMsisdn).pipe(
					tap(_ => {
						this.loading = false;
					}),
					catchError((_) => {
						this.loading = false;
						return of(true)
					})
				)
        .toPromise();
      this.purchaseType = msisdnHasOM
        ? OPERATION_TRANSFER_OM
        : OPERATION_TRANSFER_OM_WITH_CODE;
      this.userHasNoOmAccount = !msisdnHasOM;
      this.userHasNoOmAccount
        ? this.initTransferWithCodeForm(1)
        : this.initForm(1);
      this.ref.detectChanges();
      return 1;
    }
    return 0;
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

  initForm(minValue: number, initialValue?: number) {
    this.setAmountForm = this.fb.group({
      amount: [initialValue, [Validators.required, Validators.min(minValue)]],
    });
  }

  goNext() {
    const amount = this.setAmountForm.value['amount'];
    this.purchasePayload.amount = amount;
    this.purchasePayload.includeFee = this.includeFees;
    this.purchasePayload.fee = this.fee;
    this.purchasePayload.purchaseType = this.purchaseType;
    this.purchasePayload.sending_fees = this.sending_fees_Info.effective_fees;
    this.purchasePayload.sending_fees_Info = this.sending_fees_Info;
    this.purchasePayload.reason = this.reason?.value;
    if (this.purchaseType === OPERATION_TRANSFER_OM_WITH_CODE) {
      this.purchasePayload.recipientFirstname =
        this.setAmountForm.value['recipientFirstname'];
      this.purchasePayload.recipientLastname =
        this.setAmountForm.value['recipientLastname'];
    }
    this.checkOMBalanceSuffiency(this.totalAmount);
  }

  checkOMBalanceSuffiency(amount) {
    this.checkingAmount = true;
    this.omService.checkBalanceSufficiency(amount).subscribe(
      (hasEnoughBalance) => {
        this.checkingAmount = false;
        if (hasEnoughBalance) {
          this.redirectRecapPage(this.purchasePayload);
        } else {
          this.error = BALANCE_INSUFFICIENT_ERROR;
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
  }

  getOMTransferFees(om_service: string) {
    this.hasError = false;
    this.loadingFees = true;
    return this.feeService
      .getFeesByOMService(om_service, this.purchasePayload.recipientMsisdn)
      .pipe(
        tap((fees: FeeModel[]) => {
          this.loadingFees = false;
          this.transferFeesArray[om_service] = fees;
          if (!fees.length) {
            this.hasError = true;
          }
        }),
        catchError((err: any) => {
          this.hasError = true;
          this.loadingFees = false;
          return of(err);
        })
      );
  }

  toggleTransferWithCode(event, amountInputValue) {
    const checked = event.detail.checked;
    const amount = +amountInputValue;
    if (checked) {
      this.initTransferWithCodeForm(amount);
      this.purchaseType = OPERATION_TRANSFER_OM_WITH_CODE;
    } else {
      this.initForm(1, amount);
      this.purchaseType = OPERATION_TRANSFER_OM;
    }
    this.getCurrentFee(amount);
    this.onAmountChanged({ target: { value: amount } });
  }

  handleFees(event, amountInputValue) {
    if (this.purchaseType === OPERATION_TRANSFER_OM) {
      const amount = +amountInputValue;
      this.sending_fees_Info = this.feeService.extractSendingFeesTransfertOM(
        this.transferFeesArray[OM_LABEL_SERVICES.TAF],
        amount
      );
      this.includeFees = event.detail.checked;
      this.includeFees
        ? (this.totalAmount =
            amount + this.fee + this.sending_fees_Info.effective_fees)
        : (this.totalAmount = amount + this.sending_fees_Info.effective_fees);
    }
  }

  getCurrentFee(amount) {
    this.error = null;
    if (amount && this.purchaseType === OPERATION_TRANSFER_OM_WITH_CODE) {
      const feeInfo = this.feeService.extractFees(
        this.transferFeesArray[OM_LABEL_SERVICES.TRANSFERT_AVEC_CODE],
        amount
      );
      if (!feeInfo.effective_fees) {
        this.error = TRANSFER_OM_BALANCE_NOT_ALLOWED;
        return;
      }
      this.fee = feeInfo.effective_fees;
    }
    if (amount && this.purchaseType === OPERATION_TRANSFER_OM) {
      this.sending_fees_Info = this.feeService.extractSendingFeesTransfertOM(
        this.transferFeesArray[OM_LABEL_SERVICES.TAF],
        amount
      );
      if (!this.sending_fees_Info.cashout_fees) {
        this.error = TRANSFER_OM_BALANCE_NOT_ALLOWED;
        return;
      }
      this.fee = this.sending_fees_Info.cashout_fees;
    }
  }

  onAmountChanged(event: any) {
    const amount = event.target.value;
    this.totalAmount = +amount;
    this.updateInput(event);
    this.error = null;
    if (this.purchaseType === OPERATION_TRANSFER_OM_WITH_CODE) {
      const fee = this.feeService.extractFees(
        this.transferFeesArray[OM_LABEL_SERVICES.TRANSFERT_AVEC_CODE],
        amount
      );
      if (fee.effective_fees === null) {
        this.error = TRANSFER_OM_BALANCE_NOT_ALLOWED;
        return;
      }
      this.fee = fee.effective_fees;
      this.totalAmount = +amount + this.fee;
    }
    if (
      this.purchaseType === OPERATION_TRANSFER_OM ||
      this.purchaseType === OPERATION_TYPE_INTERNATIONAL_TRANSFER
    ) {
      const serviceCode =
        this.purchaseType === OPERATION_TRANSFER_OM
          ? OM_LABEL_SERVICES.TAF
          : this.country?.code;
      this.sending_fees_Info = this.feeService.extractSendingFeesTransfertOM(
        this.transferFeesArray[serviceCode],
        amount
      );
      console.log(this.sending_fees_Info);
      if (this.sending_fees_Info.effective_fees === null) {
        this.error =
          "Le montant que vous avez saisi n'est pas dans la plage autorisée";
        return;
      }
      this.fee = this.sending_fees_Info.cashout_fees;

      this.includeFees
        ? (this.totalAmount =
            +amount + this.fee + this.sending_fees_Info.effective_fees)
        : (this.totalAmount = +amount + this.sending_fees_Info.effective_fees);
    }
  }

  updateInput(eventInput: any) {
    if (!REGEX_IS_DIGIT.test(eventInput.data)) {
      const value = eventInput.target.value;
      eventInput.target.value = 0;
      eventInput.target.value = value;
    }
  }

  async openReasonModal() {
    const modal = await this.modalController.create({
      component: SelectElementModalComponent,
      cssClass: 'select-recipient-modal',
      componentProps: {
        selectedItem: this.reason,
        items: IRT_TRANSFER_REASONS,
      },
    });
    modal.onWillDismiss().then((response) => {
      if (response?.data) {
        this.reason = response?.data;
      }
    });
    return await modal.present();
  }

  goBack() {
    this.navController.pop();
  }
}
