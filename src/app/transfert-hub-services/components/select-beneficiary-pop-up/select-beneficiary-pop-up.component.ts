import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { SelectNumberPopupComponent } from 'src/shared/select-number-popup/select-number-popup.component';
import {
  formatPhoneNumber,
  REGEX_NUMBER_OM,
  OPERATION_TRANSFER_OM,
  NO_RECENTS_MSG,
  parseIntoNationalNumberFormat,
  PAYMENT_MOD_OM,
  FIVE_DAYS_DURATION_IN_MILLISECONDS,
	OPERATION_BLOCK_TRANSFER,
} from 'src/shared';
import { MatDialog } from '@angular/material/dialog';
import { Contacts, Contact } from '@ionic-native/contacts';
import { ModalController } from '@ionic/angular';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { NoOmAccountModalComponent } from 'src/shared/no-om-account-modal/no-om-account-modal.component';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { RecentsOem } from 'src/app/models/recents-oem.model';
import { ModalSuccessModel } from 'src/app/models/modal-success-infos.model';
import { OperationSuccessFailModalPage } from 'src/app/operation-success-fail-modal/operation-success-fail-modal.page';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { PermissionSettingsPopupComponent } from 'src/app/components/permission-settings-popup/permission-settings-popup.component';
import { TRANSFER_OM_INTERNATIONAL_COUNTRIES } from 'src/app/utils/constants';
import { OPERATION_TYPE_INTERNATIONAL_TRANSFER } from 'src/app/utils/operations.constants';
import { ApplicationRoutingService } from 'src/app/services/application-routing/application-routing.service';
import { SelectCountryModalComponent } from '../select-country-modal/select-country-modal.component';
import { HistorikTransactionByTypeModalComponent } from 'src/app/components/historik-transaction-by-type-modal/historik-transaction-by-type-modal.component';
import { BlockTransferSuccessPopupComponent } from 'src/shared/block-transfer-success-popup/block-transfer-success-popup.component';

enum InputTypeEnum {
	tel='tel', text='text'
}
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
  @ViewChild('inputTel', { static: true })
  htmlInput: ElementRef;
  isProcessing: boolean;
  omPhoneNumber: string;
  errorMsg: string;
  dataPayload: any;
  senderMsisdn: string;
  recents: any[];
  loadingRecents: boolean;
  NO_RECENTS_MSG = NO_RECENTS_MSG;
  showRecentMessage: boolean;
  recentMessage: string;
  hideRecentsList: boolean;
  @Input() country;
	@Input() inputType: InputTypeEnum = InputTypeEnum.tel;
  constructor(
    private dialog: MatDialog,
    private contacts: Contacts,
    private modalController: ModalController,
    private modalTrxController: ModalController,
    private omService: OrangeMoneyService,
    private followAnalytics: FollowAnalyticsService,
    private dashbServ: DashboardService,
    private recentsService: RecentsService,
    private diagnostic: Diagnostic,
    private appRouting: ApplicationRoutingService
  ) {}

  ngOnInit() {
		if(!this.isForTransferBlocking) {
			this.getRecents();
			this.checkContactsAuthorizationStatus();
		}
  }

  ionViewWillEnter() {
    this.senderMsisdn = this.dashbServ.getCurrentPhoneNumber();
  }

  getRecents() {
    this.loadingRecents = true;
    this.recentsService
      .fetchRecents(OPERATION_TRANSFER_OM, 2)
      .pipe(
        map((recents: RecentsOem[]) => {
          this.loadingRecents = false;
          let results = [];
          recents.forEach((el) => {
            const dateDifference =
              new Date().getTime() - new Date(el.date).getTime();
            const isLessThan72h =
              dateDifference < FIVE_DAYS_DURATION_IN_MILLISECONDS;
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
        tap((res: { name: string; msisdn: string }[]) => {
          this.recents = res;
        }),
        catchError((err) => {
          this.loadingRecents = false;
          throw new Error(err);
        })
      )
      .subscribe();
  }

  checkContactsAuthorizationStatus() {
    this.diagnostic.getContactsAuthorizationStatus().then(
      (contactStatus) => {
        if (
          contactStatus === this.diagnostic.permissionStatus.NOT_REQUESTED ||
          contactStatus === this.diagnostic.permissionStatus.DENIED_ALWAYS
        ) {
          this.showRecentMessage = true;
          this.recentMessage =
            "Pour afficher vos contacts/bénéficiaires récents, vous devez autoriser l'accés à vos contacts.";
        }
      },
      (err) => {
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
    modal.onDidDismiss().then((response) => {});
    return modal.present();
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
    switch (true) {
      case selectedNumber.startsWith('+221') ||
        selectedNumber.startsWith('00221'):
        this.country = TRANSFER_OM_INTERNATIONAL_COUNTRIES[0];
        selectedNumber.startsWith('+221')
          ? (selectedNumber = selectedNumber.substring(4))
          : (selectedNumber = selectedNumber.substring(5));
        break;
      case selectedNumber.startsWith('+225') ||
        selectedNumber.startsWith('00225'):
        this.country = TRANSFER_OM_INTERNATIONAL_COUNTRIES[1];
        selectedNumber.startsWith('+225')
          ? (selectedNumber = selectedNumber.substring(4))
          : (selectedNumber = selectedNumber.substring(5));
        break;
      case selectedNumber.startsWith('+226') ||
        selectedNumber.startsWith('00226'):
        this.country = TRANSFER_OM_INTERNATIONAL_COUNTRIES[2];
        selectedNumber.startsWith('+226')
          ? (selectedNumber = selectedNumber.substring(4))
          : (selectedNumber = selectedNumber.substring(5));
        break;
      case selectedNumber.startsWith('+223') ||
        selectedNumber.startsWith('00223'):
        this.country = TRANSFER_OM_INTERNATIONAL_COUNTRIES[3];
        selectedNumber.startsWith('+223')
          ? (selectedNumber = selectedNumber.substring(4))
          : (selectedNumber = selectedNumber.substring(5));
        break;
      case selectedNumber.startsWith('+227') ||
        selectedNumber.startsWith('00227'):
        this.country = TRANSFER_OM_INTERNATIONAL_COUNTRIES[4];
        selectedNumber.startsWith('+227')
          ? (selectedNumber = selectedNumber.substring(4))
          : (selectedNumber = selectedNumber.substring(5));
        break;
      case selectedNumber.startsWith('+245') ||
        selectedNumber.startsWith('00245'):
        this.country = TRANSFER_OM_INTERNATIONAL_COUNTRIES[5];
        selectedNumber.startsWith('+245')
          ? (selectedNumber = selectedNumber.substring(4))
          : (selectedNumber = selectedNumber.substring(5));
        break;
      default:
        break;
    }
    if (this.validateNumber(selectedNumber)) {
      this.otherBeneficiaryNumber = selectedNumber;
      this.getContactFormattedName(contact);
    } else {
      this.hasErrorGetContact = true;
      this.errorGetContact = `Veuillez choisir un numéro valide pour continuer. Numéro sélectionné: ${selectedNumber}`;
    }
  }

  validateNumber(phoneNumber: string) {
    switch (this.country?.callId) {
      case TRANSFER_OM_INTERNATIONAL_COUNTRIES[0].callId: // Senegal
        return REGEX_NUMBER_OM.test(phoneNumber);
      case TRANSFER_OM_INTERNATIONAL_COUNTRIES[1].callId: // Côte d'Ivoire
        return phoneNumber.length === 10;
      case TRANSFER_OM_INTERNATIONAL_COUNTRIES[2].callId: // Burkina
      case TRANSFER_OM_INTERNATIONAL_COUNTRIES[3].callId: // Mali
      case TRANSFER_OM_INTERNATIONAL_COUNTRIES[4].callId: // Niger
        return phoneNumber.length === 8;
      case TRANSFER_OM_INTERNATIONAL_COUNTRIES[5].callId: // Bissau
        return phoneNumber.length === 9;
    }
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
        recipientFirstname: this.firstName ? this.firstName : '',
        recipientLastname: this.lastName ? this.lastName : '',
        recipientName: `${this.firstName ? this.firstName + ' ' : ''} ${
          this.lastName ? this.lastName : ''
        }`,
      };
      this.checkTransferType(payload);
    } else if (this.otherBeneficiaryNumber && this.recipientContactInfos) {
      this.recipientNumber = this.otherBeneficiaryNumber;
      const payload = {
        senderMsisdn: '',
        recipientMsisdn: this.recipientNumber,
        recipientFirstname: this.firstName,
        recipientLastname: this.lastName,
        recipientName: this.firstName + ' ' + this.lastName,
      };
      this.checkTransferType(payload);
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

  checkTransferType(payload: any) {
    if (
      this.country?.callId === TRANSFER_OM_INTERNATIONAL_COUNTRIES[0].callId
    ) {
      this.getOmPhoneNumberAndCheckrecipientHasOMAccount(payload);
    } else {
      const pageData = Object.assign(payload, {
        purchaseType: OPERATION_TYPE_INTERNATIONAL_TRANSFER,
        country: this.country,
      });
      this.modalController.dismiss(pageData);
      this.appRouting.goSetTransferAmountPage(pageData);
    }
  }

  validateReference(trxInfos?, transactionModal?: any) {
    this.isProcessing = true;
		this.hasErrorGetContact = false;
    const txnid = trxInfos
      ? trxInfos.txnid
      : this.htmlInput.nativeElement.value;
    this.omService
      .isTxnEligibleToBlock(txnid)
      .pipe(
        tap(async (res) => {
          this.isProcessing = false;
					console.log('res', res);

          if (!res.eligible) {
            this.hasErrorGetContact = true;
            this.errorGetContact = res.message;

					} else {
            await this.modalController.dismiss();
            this.openPinPadToBlock(trxInfos,res.transactionDetails);
          }
        }),
        catchError((err) => {
          this.isProcessing = false;
          this.hasErrorGetContact = true;
					console.log('err', err);

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

	async openPinPadToBlock(transactionItem: any, cancelTrxPayload: any) {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        transactionToBlock: transactionItem,
        opXtras: { blockTrxOMPayload: cancelTrxPayload},
        operationType: OPERATION_BLOCK_TRANSFER,
      },
    });
    modal.onDidDismiss().then(async response => {
      if (response.data && response.data.success) {
        await this.modalController.dismiss();
        const hasOMStatusFull = response?.data?.hasOMStatusFull;
        const isMarchandLite = response?.data?.annulationResponse?.marchandLite;
        this.openBlockTxnModalSuccess(transactionItem, hasOMStatusFull, isMarchandLite);
      }
    });
    return await modal.present();
  }

	async openBlockTxnModalSuccess(transactionItem: any, userHasOmStatusFull?: boolean, isMLite?: boolean) {
    const modal = await this.modalController.create({
      component: BlockTransferSuccessPopupComponent,
      cssClass: 'success-or-fail-modal',
      backdropDismiss: false,
      componentProps: {
        transactionToBlock: transactionItem,
        isUserOMFull: userHasOmStatusFull,
				isMLite
      },
    });
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
          this.appRouting.goSetTransferAmountPage(pageData);
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
        this.modalController.dismiss();
        this.appRouting.goSetTransferAmountPage(pageData);
      }
    });
    return await modal.present();
  }

  async openSelectCountryModal(ev: MouseEvent) {
    ev.stopPropagation();
    await this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: SelectCountryModalComponent,
      cssClass: 'select-recipient-modal',
      componentProps: {
        country: this.country
          ? this.country
          : TRANSFER_OM_INTERNATIONAL_COUNTRIES[0],
      },
    });
    modal.onWillDismiss().then(async (response) => {
      const country = response?.data;
      switch (country?.callId) {
        case undefined:
          break;
        default:
          await modal.dismiss();
          this.reOpenRecipientModal(country);
          break;
      }
    });
    return await modal.present();
  }

  async reOpenRecipientModal(country?) {
    const modal = await this.modalController.create({
      component: SelectBeneficiaryPopUpComponent,
      cssClass: 'select-recipient-modal',
      componentProps: {
        country,
      },
    });
    return await modal.present();
  }

	async selectTransaction() {
    const modal = await this.modalTrxController.create({
      component: HistorikTransactionByTypeModalComponent,
      //cssClass: 'select-recipient-modal',
      componentProps: {
        typeTransaction: 'OM',
      },
    });
    modal.onDidDismiss().then((res: any) => {
      if (res && res.data) {
				this.validateReference(res?.data?.purchaseInfos)
      }
    });
    return await modal.present();
	}
}
