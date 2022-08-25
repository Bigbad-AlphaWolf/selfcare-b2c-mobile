import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  LoadingController,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';
import { OperationExtras } from '../models/operation-extras.model';
import {
  FACE_ID_PERMISSIONS,
  OrangeMoneyService,
} from '../services/orange-money-service/orange-money.service';
import { OM_LABEL_SERVICES } from '../utils/bills.util';
import {
  OPERATION_TRANSFER_OM,
  OPERATION_TRANSFER_OM_WITH_CODE,
  TRANSFER_OM_BALANCE_NOT_ALLOWED,
  REGEX_IS_DIGIT,
  FEES_ERROR,
  BALANCE_INSUFFICIENT_ERROR,
  IRT_TRANSFER_REASONS,
  OPERATION_TRANSACTION_STATUS,
  PAYMENT_MOD_OM,
  OPERATION_TYPE_SEDDO_BONUS,
  OPERATION_TYPE_SEDDO_CREDIT,
  RECHARGEMENT_COMPTEUR_CODE,
  BONUS_COMPTEUR_CODE,
  BONUS_ALL_DEST_COMPTEUR_CODE,
  TRANSFER_BONUS_CREDIT_FEE,
  CREDIT_FEE_INSUFFICIENT_ERROR,
  MIN_BONUS_REMAINING_AMOUNT,
  BONUS_INSUFFICIENT_ERROR,
  PAYMENT_MOD_BONUS,
  PAYMENT_MOD_CREDIT,
} from '../../../src/shared';
import { FeeModel } from '../services/orange-money-service';
import { FeesService } from '../services/fees/fees.service';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
import { OPERATION_TYPE_CARD_TO_WALLET, OPERATION_TYPE_INTERNATIONAL_TRANSFER } from '../utils/operations.constants';
import { SelectElementModalComponent } from 'src/shared/select-element-modal/select-element-modal.component';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { TransactionFinalityModalComponent } from 'src/shared/transaction-finality-modal/transaction-finality-modal.component';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { ModalSuccessModel } from '../models/modal-success-infos.model';
import { OperationSuccessFailModalPage } from '../operation-success-fail-modal/operation-success-fail-modal.page';
import { FaceIdRequestModalComponent } from 'src/shared/face-id-request-modal/face-id-request-modal.component';
import { OperationService } from '../services/oem-operation/operation.service';
import { TransfertBonnus } from '../services/dashboard-service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { UserConsoService } from '../services/user-cunsommation-service/user-conso.service';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { PinPadComponent } from 'src/shared/pin-pad/pin-pad.component';

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
  OPERATION_TYPE_CARD_TO_WALLET = OPERATION_TYPE_CARD_TO_WALLET;
  OPERATION_TYPE_SEDDO_BONUS = OPERATION_TYPE_SEDDO_BONUS;
  OPERATION_TYPE_SEDDO_CREDIT = OPERATION_TYPE_SEDDO_CREDIT;
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
  title: string;
  isIos: boolean;
  constructor(
    private route: ActivatedRoute,
    private omService: OrangeMoneyService,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private navController: NavController,
    private feeService: FeesService,
    private operationService: OperationService,
    public loadingController: LoadingController,
    private modalController: ModalController,
    private iab: InAppBrowser,
    private platform: Platform,
    private dashboardService: DashboardService,
    private consoService: UserConsoService,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.initFees();
    this.isIos = this.platform.is('ios');
  }

  async initFees() {
    const isDeeplinkTransferOM = await this.checkTransferOMDeeplink();
    if (isDeeplinkTransferOM) return;
    this.purchasePayload = history.state;
    this.purchaseType = this.purchasePayload?.purchaseType;
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
    const amount = this.route.snapshot.paramMap.get('amount') ? +this.route.snapshot.paramMap.get('amount') : null;
    if (msisdn) {
      this.purchasePayload = {
        recipientMsisdn: msisdn,
        recipientFirstname: '',
        recipientLastname: '',
      };
      await this.getOMTransferFees(OM_LABEL_SERVICES.TRANSFERT_AVEC_CODE)
        .pipe(
          switchMap(res => {
            return this.getOMTransferFees(OM_LABEL_SERVICES.TAF);
          })
        )
        .toPromise();
      const msisdnHasOM = await this.omService.checkUserHasAccount(msisdn).toPromise();
      this.purchaseType = msisdnHasOM ? OPERATION_TRANSFER_OM : OPERATION_TRANSFER_OM_WITH_CODE;
      this.userHasNoOmAccount = !msisdnHasOM;
      this.userHasNoOmAccount ? this.initTransferWithCodeForm(amount) : this.initForm(1, amount);
      this.onAmountChanged({ target: { value: amount } });
      this.ref.detectChanges();
      return 1;
    }
    return 0;
  }

  async processInfosFromBeneficiaryPage() {
    this.purchasePayload = history.state;
    this.purchaseType = this.purchasePayload.purchaseType;
    if (this.purchaseType === OPERATION_TYPE_CARD_TO_WALLET) {
      this.initForm(5000);
      this.getOMTransferFees(OM_LABEL_SERVICES.CARD_TO_WALLET).subscribe();
      return;
    }
    if (this.purchaseType === OPERATION_TYPE_SEDDO_CREDIT) {
      this.sending_fees_Info.effective_fees = TRANSFER_BONUS_CREDIT_FEE;
      this.initForm(100);
      return;
    }
    if (this.purchaseType === OPERATION_TYPE_SEDDO_BONUS) {
      this.processTransferBonusInfos();
      return;
    }
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
      .checkUserHasAccount(this.purchasePayload.recipientMsisdn)
      .pipe(
        tap(_ => {
          this.loading = false;
        }),
        catchError(_ => {
          this.loading = false;
          return of(true);
        })
      )
      .toPromise();
    this.purchaseType = msisdnHasOM ? OPERATION_TRANSFER_OM : OPERATION_TRANSFER_OM_WITH_CODE;
    this.userHasNoOmAccount = !msisdnHasOM;
    this.userHasNoOmAccount ? this.initTransferWithCodeForm(1) : this.initForm(1);
    this.ref.detectChanges();
    return 1;
  }

  processTransferBonusInfos() {
    this.sending_fees_Info.effective_fees = TRANSFER_BONUS_CREDIT_FEE;
    this.loadingFees = true;
    this.operationService
      .getTransferBonusMinMaxAmount()
      .pipe(
        tap(thresholds => {
          this.initForm(thresholds.minTransferBonusAmount, null, thresholds.maxTransferBonusAmount);
          this.loadingFees = false;
        })
      )
      .subscribe();
  }

  initTransferWithCodeForm(initialValue?: number) {
    this.setAmountForm = this.fb.group({
      amount: [initialValue, [Validators.required, Validators.min(1)]],
      recipientFirstname: ['', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z ]*')]],
      recipientLastname: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],
    });
  }

  initForm(minValue: number, initialValue?: number, maxValue?: number) {
    this.setAmountForm = this.fb.group({
      amount: [initialValue, [Validators.required, Validators.min(minValue), Validators.max(maxValue)]],
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
    if (this.purchaseType === OPERATION_TYPE_SEDDO_CREDIT) {
      this.transferCredit();
      return;
    }
    if (this.purchaseType === OPERATION_TYPE_SEDDO_BONUS) {
      this.transferBonus();
      return;
    }
    if (this.purchaseType === OPERATION_TRANSFER_OM_WITH_CODE) {
      this.purchasePayload.recipientFirstname = this.setAmountForm.value['recipientFirstname'];
      this.purchasePayload.recipientLastname = this.setAmountForm.value['recipientLastname'];
    }
    if (this.purchaseType === OPERATION_TYPE_CARD_TO_WALLET) {
      this.checkingAmount = true;
      const payload = {
        amount,
        receiverMsisdn: this.purchasePayload?.recipientMsisdn,
        senderMsisdn: this.dashboardService?.getCurrentPhoneNumber(),
      };
      this.omService
        .initCardToWallet(payload)
        .pipe(
          tap((res) => {
            this.checkingAmount = false;
            this.openC2WInAppBrowser(res.paymentUrl);
          }),
          catchError((err) => {
            this.checkingAmount = false;
            this.error = err?.error?.message
              ? err.error.message
              : `Une erreur s'est produite. Veuillez réessayer plus tard`;
            return throwError(err);
          })
        )
        .subscribe();
      return;
    }
    this.checkOMBalanceSuffiency(this.totalAmount);
  }

  openC2WInAppBrowser(url: string) {
    const options: InAppBrowserOptions = this.isIos
      ? {
          location: 'no',
          toolbar: 'yes',
          toolbarcolor: '#CCCCCC',
          toolbarposition: 'top',
          toolbartranslucent: 'no',
          closebuttoncolor: '#000000',
          closebuttoncaption: 'Fermer',
          hidespinner: 'yes',
        }
      : {};
    this.iab.create(url, '_blank', options).on('exit').subscribe(event => {
      this.openC2WSuccess({
        msisdnBuyer: this.purchasePayload?.senderMsisdn,
        amount: this.setAmountForm.value['amount'],
        recipientMsisdn: this.purchasePayload?.recipientMsisdn,
        purchaseType: this.purchaseType,
        buyForMe: this.purchasePayload?.senderMsisdn === this.purchasePayload?.recipientMsisdn,
        operationStatus: OPERATION_TRANSACTION_STATUS.PROCESSING,
      });
    });
  }

  async openC2WSuccess(params: ModalSuccessModel) {
    const modal = await this.modalController.create({
      component: TransactionFinalityModalComponent,
      cssClass: "success-or-fail-modal",
      componentProps: params,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((res) => {});
    return await modal.present();
  }
  async transferCredit() {
    this.checkingAmount = true;
    this.consoService
      .getUserCunsomation()
      .pipe(
        switchMap(async conso => {
          this.checkingAmount = false;
          const creditBalance = conso.find(c => c.codeCompteur === RECHARGEMENT_COMPTEUR_CODE)?.montantRestantBrut;
          if (creditBalance - MIN_BONUS_REMAINING_AMOUNT < this.purchasePayload.amount) {
            this.error = CREDIT_FEE_INSUFFICIENT_ERROR;
            return of(conso);
          }
          const modal = await this.modalController.create({
            component: PinPadComponent,
            cssClass: 'pin-pad-modal',
          });
          modal.present();
          const response = await modal.onDidDismiss();
          const pin = response?.data;
          if (!pin) return of(conso);
          const transferPayload = {
            msisdn: this.dashboardService.getCurrentPhoneNumber(),
            msisdn2: this.purchasePayload?.recipientMsisdn,
            pin,
            amount: this.purchasePayload?.amount,
          };
          const transferRequestResponse = await this.dashboardService.transferCredit(transferPayload).pipe(
            tap((res: any) => {
              this.checkingAmount = false;
              if (res.status === '200') {
                const { pin, ...followDetails } = transferPayload;
                this.openSuccessFailModal({
                  paymentMod: PAYMENT_MOD_CREDIT,
                  success: true,
                  msisdnBuyer: transferPayload?.msisdn,
                });
                this.followAnalyticsService.registerEventFollow('Transfer_Credit_Success', 'event', followDetails);
              } else {
                this.error = res.message;
                const followDetails = {
                  code_error: res.status,
                  msisdn: this.dashboardService.getCurrentPhoneNumber(),
                  msisdn2: this.purchasePayload?.recipientMsisdn,
                  message: this.error,
                };
                this.followAnalyticsService.registerEventFollow('Transfer_Credit_Error', 'error', followDetails);
              }
            })
          ).toPromise();
          return transferRequestResponse;
        })
      )
      .subscribe();
  }

  transferBonus() {
    this.checkingAmount = true;
    const transfertbonusPayload: TransfertBonnus = {
      amount: this.purchasePayload.amount,
      dmsisdn: this.purchasePayload.recipientMsisdn,
      smsisdn: this.dashboardService.getCurrentPhoneNumber(),
    };
    this.consoService
      .getUserCunsomation()
      .pipe(
        switchMap(conso => {
          const bonusBalance = conso.find(c => c.codeCompteur === BONUS_COMPTEUR_CODE)?.montantRestantBrut,
            bonusTteDestBalance = conso.find(c => c.codeCompteur === BONUS_ALL_DEST_COMPTEUR_CODE)?.montantRestantBrut,
            creditBalance = conso.find(c => c.codeCompteur === RECHARGEMENT_COMPTEUR_CODE)?.montantRestantBrut;
          if (!creditBalance || creditBalance < TRANSFER_BONUS_CREDIT_FEE) {
            this.checkingAmount = false;
            this.error = CREDIT_FEE_INSUFFICIENT_ERROR;
            return of(conso);
          } else if (
            (!bonusBalance && !bonusTteDestBalance) ||
            bonusBalance + bonusTteDestBalance - MIN_BONUS_REMAINING_AMOUNT < this.purchasePayload.amount
          ) {
            this.checkingAmount = false;
            this.error = BONUS_INSUFFICIENT_ERROR;
            return of(conso);
          }
          return this.dashboardService.transferBonus(transfertbonusPayload).pipe(
            tap((res: any) => {
              if (res.code === '0') {
                this.followAnalyticsService.registerEventFollow('Transfer_Bonus_Success', 'event', transfertbonusPayload);
                this.openSuccessFailModal({
                  paymentMod: PAYMENT_MOD_BONUS,
                  success: true,
                  msisdnBuyer: transfertbonusPayload.smsisdn,
                });
              } else {
                this.error = res.message;
                const followDetails = { error_code: `${res.code}` };
                this.followAnalyticsService.registerEventFollow('Transfer_Bonus_Error', 'error', followDetails);
              }
            })
          );
        })
      )
      .subscribe();
  }

  checkOMBalanceSuffiency(amount) {
    this.checkingAmount = true;
    this.omService.checkBalanceSufficiency(amount).subscribe(
      hasEnoughBalance => {
        this.checkingAmount = false;
        if (hasEnoughBalance) {
          this.openPinpad();
        } else {
          this.error = BALANCE_INSUFFICIENT_ERROR;
        }
      },
      err => {
        this.checkingAmount = false;
        this.openPinpad();
      }
    );
  }

  getOMTransferFees(om_service: string) {
    this.hasError = false;
    this.loadingFees = true;
    return this.feeService.getFeesByOMService(om_service, this.purchasePayload.recipientMsisdn).pipe(
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
      this.sending_fees_Info = this.feeService.extractSendingFeesTransfertOM(this.transferFeesArray[OM_LABEL_SERVICES.TAF], amount);
      this.includeFees = event.detail.checked;
      this.includeFees
        ? (this.totalAmount = amount + this.fee + this.sending_fees_Info.effective_fees)
        : (this.totalAmount = amount + this.sending_fees_Info.effective_fees);
    }
  }

  getCurrentFee(amount) {
    this.error = null;
    if (amount && this.purchaseType === OPERATION_TRANSFER_OM_WITH_CODE) {
      const feeInfo = this.feeService.extractFees(this.transferFeesArray[OM_LABEL_SERVICES.TRANSFERT_AVEC_CODE], amount);
      if (!feeInfo.effective_fees) {
        this.error = TRANSFER_OM_BALANCE_NOT_ALLOWED;
        return;
      }
      this.fee = feeInfo.effective_fees;
    }
    if (amount && this.purchaseType === OPERATION_TRANSFER_OM) {
      this.sending_fees_Info = this.feeService.extractSendingFeesTransfertOM(this.transferFeesArray[OM_LABEL_SERVICES.TAF], amount);
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
    if (this.purchaseType === OPERATION_TYPE_SEDDO_BONUS || this.purchaseType === OPERATION_TYPE_SEDDO_CREDIT) {
      this.totalAmount = +amount + this.sending_fees_Info.effective_fees;
      return;
    }
    if (
      this.purchaseType === OPERATION_TRANSFER_OM_WITH_CODE ||
      this.purchaseType === OPERATION_TYPE_CARD_TO_WALLET
    ) {
      const feeService =
        this.purchaseType === OPERATION_TRANSFER_OM_WITH_CODE
          ? OM_LABEL_SERVICES.TRANSFERT_AVEC_CODE
          : OM_LABEL_SERVICES.CARD_TO_WALLET;
      const fee = this.feeService.extractFees(
        this.transferFeesArray[feeService],
        amount
      );
      if (fee.effective_fees === null) {
        this.error = TRANSFER_OM_BALANCE_NOT_ALLOWED;
        return;
      }
      this.fee = fee.effective_fees;
      this.totalAmount = +amount + this.fee;
    }
    if (this.purchaseType === OPERATION_TRANSFER_OM || this.purchaseType === OPERATION_TYPE_INTERNATIONAL_TRANSFER) {
      const serviceCode = this.purchaseType === OPERATION_TRANSFER_OM ? OM_LABEL_SERVICES.TAF : this.country?.code;
      this.sending_fees_Info = this.feeService.extractSendingFeesTransfertOM(this.transferFeesArray[serviceCode], amount);
      if (this.sending_fees_Info.effective_fees === null) {
        this.error = "Le montant que vous avez saisi n'est pas dans la plage autorisée";
        return;
      }
      this.fee = this.sending_fees_Info.cashout_fees;

      this.includeFees
        ? (this.totalAmount = +amount + this.fee + this.sending_fees_Info.effective_fees)
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
    modal.onWillDismiss().then(response => {
      if (response?.data) {
        this.reason = response?.data;
      }
    });
    return await modal.present();
  }

  async openPinpad() {
    const transferOMPayload = {
      amount: this.purchasePayload?.amount,
      msisdn2: this.purchasePayload?.recipientMsisdn,
      a_ma_charge: this.purchasePayload?.includeFee,
      send_fees: this.purchasePayload?.sending_fees,
      cashout_fees: this.purchasePayload?.fee,
      country: this.purchasePayload?.country,
      reason: this.purchasePayload?.reason,
    };
    const transferOMWithCodePayload = {
      amount: this.purchasePayload?.amount,
      msisdn2: this.purchasePayload?.recipientMsisdn,
      nom_receiver: this.purchasePayload?.recipientLastname,
      prenom_receiver: this.purchasePayload?.recipientFirstname,
    };
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      backdropDismiss: true,
      swipeToClose: true,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: this.purchaseType,
        opXtras: this.purchasePayload,
        transferMoneyPayload: transferOMPayload,
        transferMoneyWithCodePayload: transferOMWithCodePayload,
      },
    });
    modal.onDidDismiss().then(response => {
      if (response.data && response.data.success) {
        this.openSuccessFailModal(
          {
            paymentMod: PAYMENT_MOD_OM,
            opXtras: response.data.opXtras,
            historyTransactionItem: response.data.transferToBlock,
            success: true,
            msisdnBuyer: this.omService.getOrangeMoneyNumber(),
            buyForMe: this.purchasePayload?.recipientMsisdn === this.omService.getOrangeMoneyNumber(),
          },
          response.data.operationPayload
        );
      }
    });
    return await modal.present();
  }

  async openSuccessFailModal(params: ModalSuccessModel, orangeMoneyData?: any) {
    params.recipientMsisdn = this.purchasePayload?.recipientMsisdn;
    params.recipientName = this.purchasePayload?.recipientName;
    params.purchaseType = this.purchaseType;
    params.amount = this.purchasePayload?.amount;
    params.opXtras = this.purchasePayload;
    const modal = await this.modalController.create({
      component: OperationSuccessFailModalPage,
      cssClass: 'success-or-fail-modal',
      componentProps: params,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(res => {
      if (orangeMoneyData) {
        this.suggestFaceId(orangeMoneyData);
      }
    });
    return await modal.present();
  }

  async suggestFaceId(operationData?) {
    const status = await this.omService.checkFaceIdStatus();
    if (status === FACE_ID_PERMISSIONS.LATER || !status) {
      const modal = await this.modalController.create({
        component: FaceIdRequestModalComponent,
        cssClass: 'select-recipient-modal',
        backdropDismiss: true,
        componentProps: { operationData },
      });
      modal.onDidDismiss().then(() => {});
      return await modal.present();
    }
  }

  goBack() {
    console.log('clicked');

    this.navController.pop();
  }
}
