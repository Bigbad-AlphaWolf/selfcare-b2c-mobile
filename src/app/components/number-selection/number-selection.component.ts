import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import {
  formatPhoneNumber,
  REGEX_NUMBER_OM,
  SubscriptionModel,
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TYPE_PASS_VOYAGE,
  CODE_KIRENE_Formule,
  REGEX_FIX_NUMBER,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_PASS_ILLIFLEX,
  OPERATION_TYPE_PASS_ALLO,
  OPERATION_TYPE_PASS_INTERNET,
  NO_RECENTS_MSG,
  OPERATION_TYPE_PASS_INTERNATIONAL,
  OPERATION_TYPE_PASS_LAMBJ,
  OPERATION_TYPE_SEDDO_CREDIT,
  OPERATION_TYPE_SEDDO_BONUS,
} from 'src/shared';
import { ModalController } from '@ionic/angular';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OmSession } from 'src/app/models/om-session.model';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { of, Observable } from 'rxjs';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { catchError, share, tap, map, delay } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { NumberSelectionOption } from 'src/app/models/enums/number-selection-option.enum';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { RecentsOem } from 'src/app/models/recents-oem.model';
import { SessionOem } from 'src/app/services/session-oem/session-oem.service';
import { CODE_FORMULE_FIX_PREPAID } from 'src/app/dashboard';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { PermissionSettingsPopupComponent } from '../permission-settings-popup/permission-settings-popup.component';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';

@Component({
  selector: 'oem-number-selection',
  templateUrl: './number-selection.component.html',
  styleUrls: ['./number-selection.component.scss'],
})
export class NumberSelectionComponent implements OnInit {
  numbers$: Observable<string[]>;
  recents: any[];
  numberSelected: string = '';
  numberFromInput: string = '';

  isProcessing: boolean;
  showInput: boolean = false;
  phoneIsNotValid: boolean = false;

  omSession: OmSession = {};
  opXtras: OperationExtras = {};
  isErrorProcessing: boolean = false;
  canNotRecieve: boolean;
  canNotRecieveError = 'Le numéro de votre destinataire ne peut pas recevoir ce service';
  option: NumberSelectionOption = NumberSelectionOption.WITH_MY_PHONES;
  eligibilityChecked: boolean;
  isRecipientEligible = true;
  eligibilityError: string;
  @Input() data;
  loadingNumbers: boolean;
  currentPhone: string = SessionOem.PHONE.trim();
  loadingRecents: boolean;
  NO_RECENTS_MSG = NO_RECENTS_MSG;
  showRecentMessage: boolean;
  recentMessage: string;
  hideRecentsList: boolean;

  constructor(
    private modalController: ModalController,
    private omService: OrangeMoneyService,
    private dashbServ: DashboardService,
    private authService: AuthenticationService,
    private changeDetectorRef: ChangeDetectorRef,
    private recentsService: RecentsService,
    private oemLoggingService: OemLoggingService,
    private diagnostic: Diagnostic
  ) {}

  ngOnInit() {
    this.option = this.data && this.data.option ? this.data.option : NumberSelectionOption.NONE;
    this.showInput = this.option === NumberSelectionOption.NONE;
    this.opXtras.recipientMsisdn = this.currentPhone;
    this.opXtras.senderMsisdn = SessionOem.PHONE;
    this.loadingNumbers = true;
    this.numbers$ = this.dashbServ.fetchOemNumbers(this.data.purchaseType, this.data?.opXtras).pipe(
      delay(100),
      tap(numbers => {
        this.loadingNumbers = false;
      }),
      catchError((err: any) => {
        this.loadingNumbers = false;
        return of(err);
      }),
      share()
    );
    if (this.data.purchaseType !== OPERATION_TYPE_SEDDO_CREDIT && this.data.purchaseType !== OPERATION_TYPE_SEDDO_BONUS) {
      this.checkOmAccount();
    }
    this.checkContactsAuthorizationStatus();
  }

  getRecents() {
    this.loadingRecents = true;
    this.recentsService
      .fetchRecents(this.data.purchaseType, 2)
      .pipe(
        map((recents: RecentsOem[]) => {
          this.loadingRecents = false;
          let results = [];
          recents.forEach(el => {
            results.push({
              name: el.name,
              msisdn: el.destinataire,
            });
          });
          return results;
        }),
        tap((res: { name: string; msisdn: string }[]) => {
          this.recents = res;
          this.oemLoggingService.registerEvent(
            'Get_recents_destinataire_OM_success',
            convertObjectToLoggingPayload({
              operation: this.data.purchaseType,
              sender: this.opXtras.senderMsisdn,
            })
          );
        }),
        catchError(err => {
          this.loadingRecents = false;
          this.oemLoggingService.registerEvent(
            'Get_recents_destinataire_OM_error',
            convertObjectToLoggingPayload({
              operation: this.data.purchaseType,
              sender: this.opXtras.senderMsisdn,
              error: err.status,
            })
          );
          return of([]);
        }),
        share()
      )
      .subscribe();
  }

  checkContactsAuthorizationStatus() {
    this.diagnostic.getContactsAuthorizationStatus().then(
      contactStatus => {
        if (contactStatus === this.diagnostic.permissionStatus.NOT_REQUESTED || contactStatus === this.diagnostic.permissionStatus.DENIED_ALWAYS) {
          this.showRecentMessage = true;
          this.recentMessage = "Pour afficher vos contacts/bénéficiaires récents, vous devez autoriser l'accés à vos contacts.";
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  handleInputFocus(event) {
    this.hideRecentsList = event;
  }

  async openSettingsPopup() {
    await this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: PermissionSettingsPopupComponent,
      cssClass: 'success-or-fail-modal',
    });
    modal.onDidDismiss().then(response => {});
    return modal.present();
  }

  async onContinue(phone?: string) {
    this.eligibilityChecked = false;
    this.canNotRecieve = false;
    if (phone) {
      this.opXtras.recipientMsisdn = phone;
      this.oemLoggingService.registerEvent(
        'Select_recents_buy',
        convertObjectToLoggingPayload({
          msisdn: this.currentPhone,
          recent: phone,
        })
      );
    }
    if (this.checkIfIsRecipientInvalid()) {
      this.canNotRecieve = true;
      return;
    }

    this.opXtras.destinataire = this.opXtras.recipientMsisdn = formatPhoneNumber(this.opXtras.recipientMsisdn);

    this.opXtras.forSelf = !this.showInput;

    if (!(await this.canRecieveCredit())) {
      this.canNotRecieve = true;
      const data = Object.assign({}, this.opXtras, {
        error: this.eligibilityError,
      });
      this.logRecipientOnFollow('error', data, this.data.isLightMod);
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.dismissBottomSheet();
  }

  checkIfIsRecipientInvalid() {
    if (
      (this.data.purchaseType === OPERATION_TYPE_PASS_ILLIMIX && REGEX_FIX_NUMBER.test(this.opXtras.recipientMsisdn)) ||
      !(REGEX_NUMBER_OM.test(this.opXtras.recipientMsisdn) || REGEX_FIX_NUMBER.test(this.opXtras.recipientMsisdn))
    ) {
      return true;
    }
    return false;
  }

  async isEligible() {
    let isEligible = await this.authService.checkUserEligibility(this.opXtras.recipientMsisdn).toPromise();
    return isEligible;
  }

  dismissBottomSheet() {
    this.isProcessing = true;
    this.authService.getSubscriptionForTiers(this.opXtras.recipientMsisdn).subscribe(
      async (res: SubscriptionModel) => {
        this.isProcessing = false;
        this.opXtras.code = res.code;
        this.opXtras.profil = res.profil;
        if (res.code === CODE_KIRENE_Formule && this.data.purchaseType === OPERATION_TYPE_PASS_ILLIMIX) {
          const eligibility: any = await this.isEligible();
          this.eligibilityChecked = true;
          if (eligibility && !eligibility.eligible) {
            this.isRecipientEligible = false;
            this.eligibilityError = eligibility.message;
            const data = Object.assign({}, this.opXtras, {
              error: this.eligibilityError,
            });
            this.logRecipientOnFollow('error', data, this.data.isLightMod);
            return;
          }
        }
        if (
          ((res.code === CODE_KIRENE_Formule || res.code === CODE_FORMULE_FIX_PREPAID) && this.data.purchaseType === OPERATION_TYPE_PASS_ILLIFLEX) ||
          (res.code === CODE_FORMULE_FIX_PREPAID && this.data.purchaseType === OPERATION_TYPE_PASS_INTERNATIONAL)
        ) {
          this.eligibilityChecked = true;
          this.isRecipientEligible = false;
          this.eligibilityError = 'Le numéro du bénéficiaire ne peut pas bénéficier de pass';
          const data = Object.assign({}, this.opXtras, {
            error: this.eligibilityError,
          });
          this.logRecipientOnFollow('error', data, this.data.isLightMod);
          return;
        }
        this.logRecipientOnFollow('event', this.opXtras, this.data.isLightMod);
        this.modalController.dismiss(this.opXtras);
        // this.bottomSheetRef.dismiss(this.opXtras);
      },
      (err: any) => {
        this.isProcessing = false;
        const data = Object.assign({}, this.opXtras, { error: err.status });
        this.logRecipientOnFollow('error', data, this.data.isLightMod);
        this.modalController.dismiss();
        // this.bottomSheetRef.dismiss();
      }
    );
  }

  onPhoneSelected(opContacts: OperationExtras) {
    this.opXtras = opContacts;
    this.numberFromInput = opContacts.recipientMsisdn;
    this.disableErrorMessages();
  }

  onOptionChange(value: string) {
    this.showInput = value === 'AUTRE';
    this.opXtras.recipientMsisdn = this.showInput ? this.numberFromInput : value;
    this.disableErrorMessages();
  }
  disableErrorMessages() {
    this.phoneIsNotValid = false;
    this.canNotRecieve = false;
  }

  checkOmAccount() {
    this.isProcessing = true;
    this.omService.getOmMsisdn().subscribe(
      (msisdn: any) => {
        this.isProcessing = false;
        this.loadingNumbers = false;
        this.changeDetectorRef.detectChanges();
        if (msisdn === 'error' && this.data.purchaseType === OPERATION_TYPE_RECHARGE_CREDIT) {
          //force user to have om account
          this.modalController.dismiss();
          this.openPinpad();
        }

        if (msisdn !== 'error') {
          this.opXtras.senderMsisdn = msisdn;
          if (OPERATION_TYPE_PASS_VOYAGE !== this.data.purchaseType) this.getRecents();
        }
      },
      () => {
        this.modalController.dismiss();
        this.isProcessing = false;
        this.isErrorProcessing = true;
      }
    );
  }

  async canRecieveCredit() {
    // if (this.opXtras.forSelf) return true;

    let canRecieve = await this.authService
      .canRecieveCredit(this.opXtras.recipientMsisdn, this.data.opXtras)
      .pipe(
        catchError((er: HttpErrorResponse) => {
          if (er.status === 401) this.modalController.dismiss();
          return of(false);
        })
      )
      .toPromise();
    return canRecieve;
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: null,
      },
    });
    modal.onDidDismiss().then(response => {
      if (response.data && response.data.success) {
        this.omSession.loginExpired = false;
      }
    });
    return await modal.present();
  }

  logRecipientOnFollow(typeEvent: 'event' | 'error', infos: any, isLightMod?: boolean) {
    let followEventSucess: string;
    let followEventError: string;
    let payload = {
      sender: infos.senderMsisdn,
      recipient: infos.recipientMsisdn,
      operation: this.data.purchaseType.toLowerCase(),
    };
    if (infos.error) {
      payload = Object.assign({}, payload, { error: infos.error });
    }
    switch (this.data.purchaseType) {
      case OPERATION_TYPE_RECHARGE_CREDIT:
        followEventSucess = 'Recharge_Credit_Select_Recipient_success';
        followEventError = 'Recharge_Credit_Select_Recipient_error';
        break;
      case OPERATION_TYPE_PASS_INTERNET:
      case OPERATION_TYPE_PASS_ILLIMIX:
      case OPERATION_TYPE_PASS_ILLIFLEX:
      case OPERATION_TYPE_PASS_VOYAGE:
      case OPERATION_TYPE_PASS_ALLO:
      case OPERATION_TYPE_PASS_INTERNATIONAL:
        followEventSucess = 'Achat_pass_Select_Recipient_success';
        followEventError = 'Achat_pass_Select_Recipient_error';
        break;
      case OPERATION_TYPE_PASS_LAMBJ:
        followEventSucess = 'Achat_pass_lamb_Select_Recipient_success';
        followEventError = 'Achat_pass_lamb_Select_Recipient_error';
      default:
        followEventSucess = 'Achat_Select_Recipient_success';
        followEventError = 'Achat_Select_Recipient_error';
        break;
    }

    if (typeEvent === 'event') {
      this.oemLoggingService.registerEvent(followEventSucess, convertObjectToLoggingPayload(payload));
    } else {
      this.oemLoggingService.registerEvent(followEventError, convertObjectToLoggingPayload(payload));
    }
  }
}
