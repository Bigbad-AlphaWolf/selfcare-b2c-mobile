import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { SelectNumberPopupComponent } from 'src/shared/select-number-popup/select-number-popup.component';
import {
  formatPhoneNumber,
  REGEX_NUMBER_OM,
  OPERATION_TRANSFER_OM,
  NO_RECENTS_MSG,
  parseIntoNationalNumberFormat,
  OPERATION_BLOCK_TRANSFER,
  PAYMENT_MOD_OM,
  THREE_DAYS_DURATION_IN_MILLISECONDS,
} from 'src/shared';
import { MatDialog } from '@angular/material';
import { Contacts, Contact } from '@ionic-native/contacts';
import { ModalController } from '@ionic/angular';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { NoOmAccountModalComponent } from 'src/shared/no-om-account-modal/no-om-account-modal.component';
import { catchError, map, tap } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { RecentsOem } from 'src/app/models/recents-oem.model';
import { BlockTransferSuccessPopupComponent } from 'src/shared/block-transfer-success-popup/block-transfer-success-popup.component';
import { ModalSuccessModel } from 'src/app/models/modal-success-infos.model';
import { OperationSuccessFailModalPage } from 'src/app/operation-success-fail-modal/operation-success-fail-modal.page';

@Component({
  selector: 'app-select-beneficiary-pop-up',
  templateUrl: './select-beneficiary-pop-up.component.html',
  styleUrls: ['./select-beneficiary-pop-up.component.scss'],
})
export class SelectBeneficiaryPopUpComponent implements OnInit {
  hasErrorGetContact: boolean;
  errorGetContact: string;
  recipientNumber = '';
  recipientContactInfos: any;
  otherBeneficiaryNumber = '';
  firstName: string;
  lastName: string;
  @Input() isForTransferBlocking: boolean;
  @ViewChild('inputTel', { static: true }) htmlInput: ElementRef;
  isProcessing: boolean;
  omPhoneNumber: string;
  errorMsg: string;
  dataPayload: any;
  senderMsisdn: string;
  recentsRecipients$: Observable<any[]>;
  loadingRecents: boolean;
  NO_RECENTS_MSG = NO_RECENTS_MSG;
  constructor(
    private dialog: MatDialog,
    private contacts: Contacts,
    private modalController: ModalController,
    private omService: OrangeMoneyService,
    private followAnalytics: FollowAnalyticsService,
    private dashbServ: DashboardService,
    private recentsService: RecentsService
  ) {}

  ngOnInit() {
    this.getRecents();
  }

  ionViewWillEnter() {
    this.senderMsisdn = this.dashbServ.getCurrentPhoneNumber();
  }

  getRecents() {
    this.loadingRecents = true;
    this.recentsRecipients$ = this.recentsService
      .fetchRecents(OPERATION_TRANSFER_OM, 3)
      .pipe(
        map((recents: RecentsOem[]) => {
          this.loadingRecents = false;
          let results = [];
          recents.forEach((el) => {
            const dateDifference =
              new Date().getTime() - new Date(el.date).getTime();
            const isLessThan72h =
              dateDifference < THREE_DAYS_DURATION_IN_MILLISECONDS;
            if (!isLessThan72h && this.isForTransferBlocking) {
              return;
            }
            results.push({
              name: el.name,
              msisdn: el.destinataire,
              date: el.date,
              txnid: el.txnid,
            });
          });
          return results;
        }),
        catchError((err) => {
          this.loadingRecents = false;
          throw new Error(err);
        })
      );
  }

  pickContact() {
    this.hasErrorGetContact = false;
    this.recipientNumber = null;
    this.errorGetContact = null;
    this.contacts
      .pickContact()
      .then((contact: Contact) => {
        if (contact.phoneNumbers.length > 1) {
          this.openPickRecipientModal(contact);
        } else {
          const selectedNumber = formatPhoneNumber(
            contact.phoneNumbers[0].value
          );
          this.processGetContactInfos(contact, selectedNumber);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  openPickRecipientModal(contact: any) {
    const dialogRef = this.dialog.open(SelectNumberPopupComponent, {
      data: { phoneNumbers: contact.phoneNumbers },
    });
    dialogRef.afterClosed().subscribe((selectedNumber) => {
      const choosedNumber = formatPhoneNumber(selectedNumber);
      this.processGetContactInfos(contact, choosedNumber);
    });
  }

  processGetContactInfos(contact: any, selectedNumber: any) {
    if (this.validateNumber(selectedNumber)) {
      const res = parseIntoNationalNumberFormat(selectedNumber);
      this.otherBeneficiaryNumber = res;
      this.getContactFormattedName(contact);
    } else {
      this.hasErrorGetContact = true;
      this.errorGetContact = `Veuillez choisir un numéro valide pour continuer. Numéro sélectionné: ${selectedNumber}`;
    }
  }

  validateNumber(phoneNumber: string) {
    return REGEX_NUMBER_OM.test(phoneNumber);
  }

  getContactFormattedName(contact: any) {
    const givenName =
      contact && contact.name.givenName ? `${contact.name.givenName}` : '';
    const familyName =
      contact && contact.name.familyName ? ` ${contact.name.familyName}` : '';
    const middleName =
      contact && contact.name.middleName ? ` ${contact.name.middleName}` : '';
    this.recipientContactInfos =
      contact.name && contact.name.formatted
        ? contact.name.formatted
        : givenName + middleName + familyName;
    this.firstName = givenName + middleName;
    this.lastName = familyName;
  }

  validateBeneficiary(recentNumber?) {
    this.hasErrorGetContact = false;
    this.errorGetContact = null;
    if (this.isForTransferBlocking) {
      this.validateReference(recentNumber);
      return;
    }

    if (
      this.htmlInput &&
      this.htmlInput.nativeElement.value &&
      this.validateNumber(this.htmlInput.nativeElement.value)
    ) {
      this.recipientNumber = formatPhoneNumber(
        this.htmlInput.nativeElement.value
      );
      const payload = {
        senderMsisdn: '',
        recipientMsisdn: this.recipientNumber,
        recipientFirstname: '',
        recipientLastname: '',
      };
      this.getOmPhoneNumberAndCheckrecipientHasOMAccount(payload);
    } else if (this.otherBeneficiaryNumber && this.recipientContactInfos) {
      this.recipientNumber = this.otherBeneficiaryNumber;
      const payload = {
        senderMsisdn: '',
        recipientMsisdn: this.recipientNumber,
        recipientFirstname: this.firstName,
        recipientLastname: this.lastName,
      };
      this.getOmPhoneNumberAndCheckrecipientHasOMAccount(payload);
    } else if (recentNumber) {
      const payload = {
        senderMsisdn: '',
        recipientMsisdn: recentNumber,
        recipientFirstname: '',
        recipientLastname: '',
      };
      this.getOmPhoneNumberAndCheckrecipientHasOMAccount(payload);
    } else {
      this.hasErrorGetContact = true;
      this.errorGetContact =
        'Veuillez choisir un numéro de destinataire valide pour continuer';
    }
  }

  validateReference(recentReference?) {
    this.isProcessing = true;
    recentReference = recentReference
      ? recentReference.txnid
      : this.htmlInput.nativeElement.value;
    this.omService
      .isTxnEligibleToBlock(recentReference)
      .pipe(
        tap(async (res) => {
          this.isProcessing = false;
          if (!res.eligible) {
            this.hasErrorGetContact = true;
            this.errorGetContact = res.message;
          } else {
            await this.modalController.dismiss();
            this.openTransactionModal(res.transactionDetails);
          }
        }),
        catchError((err) => {
          this.isProcessing = false;
          this.hasErrorGetContact = true;
          this.errorGetContact =
            'Veuillez saisir une référence valide pour continuer';
          return throwError(err);
        })
      )
      .subscribe();
  }

  async openTransactionModal(transaction) {
    transaction = Object.assign({}, transaction, {
      operationDate: this.parseDate(transaction.date),
      amount: -+transaction.amount,
      fees: +transaction.fees,
      msisdnReceiver: transaction.destinataire,
    });
    const omMsisdn = await this.omService.getOmMsisdn().toPromise();
    const params: ModalSuccessModel = {};
    params.paymentMod = PAYMENT_MOD_OM;
    params.recipientMsisdn = transaction.destinataire;
    params.msisdnBuyer = omMsisdn;
    params.purchaseType = OPERATION_TRANSFER_OM;
    params.historyTransactionItem = transaction;
    params.success = true;
    params.isOpenedFromHistory = true;
    const modal = await this.modalController.create({
      component: OperationSuccessFailModalPage,
      cssClass: 'success-or-fail-modal',
      componentProps: params,
      backdropDismiss: true,
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }

  parseDate(date: string) {
    // takes such date (12/10/2021T15:24) as input and converts it in 2021-10-12T15:24
    const a = date.split('T');
    const b = a[0].split('/').reverse().join('-');
    return b + 'T' + a[1];
  }

  getOmPhoneNumberAndCheckrecipientHasOMAccount(payload: {
    senderMsisdn: string;
    recipientMsisdn: string;
    recipientFirstname: string;
    recipientLastname: string;
  }) {
    this.isProcessing = true;

    this.omService.getOmMsisdn().subscribe((userMsisdn) => {
      this.isProcessing = false;
      if (userMsisdn !== 'error') {
        this.omPhoneNumber = userMsisdn;
        this.checkRecipientHasOMAccount(userMsisdn, payload);
      } else {
        this.modalController.dismiss();
        this.openPinpad();
      }
    });
  }

  checkRecipientHasOMAccount(
    userOMNumber: string,
    payload: {
      senderMsisdn: string;
      recipientMsisdn: string;
      recipientFirstname: string;
      recipientLastname: string;
    }
  ) {
    this.isProcessing = true;
    this.errorMsg = null;
    this.omService.checkUserHasAccount(payload.recipientMsisdn).subscribe(
      (hasOmAccount: boolean) => {
        this.isProcessing = false;
        if (hasOmAccount) {
          const pageData = Object.assign(payload, {
            purchaseType: 'TRANSFER_MONEY',
          });
          this.modalController.dismiss(pageData);
          // this.appRouting.goSetAmountPage(pageData);
          this.followAnalytics.registerEventFollow(
            'transfert_om_select_beneficiary_success',
            'event',
            {
              sender: userOMNumber,
              receiver: payload.recipientMsisdn,
              has_om: 'true',
            }
          );
        } else {
          this.openNoOMAccountModal(payload);
          this.followAnalytics.registerEventFollow(
            'transfert_om_select_beneficiary_error',
            'event',
            {
              sender: userOMNumber,
              receiver: payload.recipientMsisdn,
              has_om: 'false',
            }
          );
          this.errorMsg = 'Recipient has No OM ';
        }
      },
      (err: HttpErrorResponse) => {
        this.isProcessing = false;
        this.errorMsg = 'Recipient has No OM';
        if (err.status === 400) {
          this.followAnalytics.registerEventFollow(
            'transfert_om_select_beneficiary_error',
            'event',
            {
              sender: this.omPhoneNumber,
              receiver: payload.recipientMsisdn,
              has_om: false,
            }
          );
          this.openNoOMAccountModal(payload);
        } else {
          this.followAnalytics.registerEventFollow(
            'transfert_om_select_beneficiary_error',
            'error',
            {
              sender: userOMNumber,
              receiver: payload.recipientMsisdn,
              error: err.status,
            }
          );
          this.errorMsg = 'Une erreur est survenue, veuillez reessayer';
        }
      }
    );
  }

  async openPinpad(payload?: any) {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: null,
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response.data && response.data.success && payload) {
        this.getOmPhoneNumberAndCheckrecipientHasOMAccount(payload);
      }
    });
    return await modal.present();
  }

  async openNoOMAccountModal(payload: {
    senderMsisdn: string;
    recipientMsisdn: string;
    recipientFirstname: string;
    recipientLastname: string;
  }) {
    const modal = await this.modalController.create({
      component: NoOmAccountModalComponent,
      cssClass: 'customModalNoOMAccountModal',
    });
    modal.onDidDismiss().then((response) => {
      if (response && response.data && response.data.continue) {
        const pageData = Object.assign(payload, {
          userHasNoOmAccount: true,
          purchaseType: 'TRANSFER_MONEY_WITH_CODE',
        });
        this.modalController.dismiss(pageData);
      }
    });
    return await modal.present();
  }
}
