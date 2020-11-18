import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectNumberPopupComponent } from 'src/shared/select-number-popup/select-number-popup.component';
import {
  formatPhoneNumber,
  REGEX_NUMBER_OM,
  OPERATION_TYPE_TRANSFER_OM,
  OPERATION_TRANSFER_OM,
} from 'src/shared';
import { MatDialog } from '@angular/material';
import { Contacts, Contact } from '@ionic-native/contacts';
import { ModalController } from '@ionic/angular';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { Router } from '@angular/router';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { NoOmAccountModalComponent } from 'src/shared/no-om-account-modal/no-om-account-modal.component';
import { map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { RecentsOem } from 'src/app/models/recents-oem.model';
import { ContactsService } from 'src/app/services/contacts-service/contacts.service';

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
  @ViewChild('inputTel') htmlInput: ElementRef;
  isProcessing: boolean;
  omPhoneNumber: string;
  errorMsg: string;
  dataPayload: any;
  senderMsisdn: string;
  recentsRecipients$: Observable<any[]>;

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
    this.recentsRecipients$ = this.recentsService
      .fetchRecents(OPERATION_TRANSFER_OM, 3)
      .pipe(
        map((recents: RecentsOem[]) => {
          let results = [];
          console.log(recents);
          recents.forEach((el) => {
            results.push({
              name: el.name,
              msisdn: el.destinataire,
            });
          });
          return results;
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
      this.otherBeneficiaryNumber = selectedNumber;
      this.getContactFormattedName(contact);
    } else {
      this.hasErrorGetContact = true;
      this.errorGetContact =
        'Veuillez choisir un numéro de destinataire valide pour continuer';
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

  validateBeneficiary(recentNumber?: string) {
    this.hasErrorGetContact = false;
    this.errorGetContact = null;

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
            'destinataire_transfert_has_om_account_success',
            'event',
            {
              transfert_om_numero_sender: userOMNumber,
              transfert_om_numero_receiver: payload.recipientMsisdn,
              has_om: 'true',
            }
          );
        } else {
          this.openNoOMAccountModal(payload);
          this.followAnalytics.registerEventFollow(
            'destinataire_transfert_has_om_account_success',
            'event',
            {
              transfert_om_numero_sender: userOMNumber,
              transfert_om_numero_receiver: payload.recipientMsisdn,
              has_om: 'false',
            }
          );
          this.errorMsg = 'Recipient has No OM ';
        }
      },
      (err: HttpErrorResponse) => {
        this.isProcessing = false;
        this.errorMsg = 'Recipient has No OM ';

        if (err.status === 400) {
          this.openNoOMAccountModal(payload);
          this.followAnalytics.registerEventFollow(
            'destinataire_transfert_has_om_account',
            'event',
            {
              transfert_om_numero_destinataire: payload.recipientMsisdn,
              has_om: 'false',
            }
          );
        } else {
          this.followAnalytics.registerEventFollow(
            'destinataire_transfert_has_om_account_error',
            'error',
            {
              transfert_om_numero_sender: userOMNumber,
              transfert_om_numero_receiver: payload.recipientMsisdn,
              error:
                'Une error ' + err.status + ' est survenue' + err && err.error
                  ? err.error.title
                  : '',
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
