import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Contact, Contacts } from '@ionic-native/contacts';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RecentsOem } from 'src/app/models/recents-oem.model';
import { ApplicationRoutingService } from 'src/app/services/application-routing/application-routing.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { RecentsService } from 'src/app/services/recents-service/recents.service';
import { TRANSFER_OM_INTERNATIONAL_COUNTRIES } from 'src/app/utils/constants';
import { OPERATION_TYPE_INTERNATIONAL_TRANSFER } from 'src/app/utils/operations.constants';
import { formatPhoneNumber, NO_RECENTS_MSG } from 'src/shared';
import { SelectNumberPopupComponent } from 'src/shared/select-number-popup/select-number-popup.component';
import { SelectCountryModalComponent } from '../select-country-modal/select-country-modal.component';

@Component({
  selector: 'app-select-irt-recipient-popup',
  templateUrl: './select-irt-recipient-popup.component.html',
  styleUrls: ['./select-irt-recipient-popup.component.scss'],
})
export class SelectIrtRecipientPopupComponent implements OnInit {
  hasErrorGetContact: boolean;
  errorGetContact: string;
  recipientNumber = '';
  recipientContactInfos: any;
  otherBeneficiaryNumber = '';
  firstName: string;
  lastName: string;
  @ViewChild('inputTel', { static: true })
  htmlInput: ElementRef;
  isProcessing: boolean;
  omPhoneNumber: string;
  errorMsg: string;
  dataPayload: any;
  senderMsisdn: string;
  recentsRecipients$: Observable<any[]>;
  loadingRecents: boolean;
  NO_RECENTS_MSG = NO_RECENTS_MSG;
  currentCountryId: number;
  @Input() country;

  constructor(
    private dialog: MatDialog,
    private contacts: Contacts,
    private modalController: ModalController,
    private dashbServ: DashboardService,
    private recentsService: RecentsService,
    private appRouting: ApplicationRoutingService
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
      .fetchRecents(OPERATION_TYPE_INTERNATIONAL_TRANSFER, 3)
      .pipe(
        map((recents: RecentsOem[]) => {
          this.loadingRecents = false;
          let results = [];
          recents.forEach((el) => {
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
        console.log(contact);

        if (contact.phoneNumbers.length > 1) {
          this.openPickRecipientModal(contact);
        } else {
          const selectedNumber = contact.phoneNumbers[0].value.replace(
            /\s/g,
            ''
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

  processGetContactInfos(contact: any, selectedNumber: string) {
    // if (selectedNumber)
    switch (true) {
      case selectedNumber.startsWith('+225') ||
        selectedNumber.startsWith('00225'):
        this.country = TRANSFER_OM_INTERNATIONAL_COUNTRIES[0];
        selectedNumber.startsWith('+225')
          ? (selectedNumber = selectedNumber.substring(4))
          : (selectedNumber = selectedNumber.substring(5));
        break;
      case selectedNumber.startsWith('+226') ||
        selectedNumber.startsWith('00226'):
        this.country = TRANSFER_OM_INTERNATIONAL_COUNTRIES[1];
        selectedNumber.startsWith('+226')
          ? (selectedNumber = selectedNumber.substring(4))
          : (selectedNumber = selectedNumber.substring(5));
        break;
      case selectedNumber.startsWith('+223') ||
        selectedNumber.startsWith('00223'):
        this.country = TRANSFER_OM_INTERNATIONAL_COUNTRIES[2];
        selectedNumber.startsWith('+223')
          ? (selectedNumber = selectedNumber.substring(4))
          : (selectedNumber = selectedNumber.substring(5));
        break;
      case selectedNumber.startsWith('+227') ||
        selectedNumber.startsWith('00227'):
        this.country = TRANSFER_OM_INTERNATIONAL_COUNTRIES[3];
        selectedNumber.startsWith('+227')
          ? (selectedNumber = selectedNumber.substring(4))
          : (selectedNumber = selectedNumber.substring(5));
        break;
      case selectedNumber.startsWith('+245') ||
        selectedNumber.startsWith('00245'):
        this.country = TRANSFER_OM_INTERNATIONAL_COUNTRIES[4];
        selectedNumber.startsWith('+245')
          ? (selectedNumber = selectedNumber.substring(4))
          : (selectedNumber = selectedNumber.substring(5));
        break;
      default:
        break;
    }
    // this.flagSrc = TRANSFER_OM_INTERNATIONAL_COUNTRIES.find(
    //   (c) => c.callId === this.selectedCountryId
    // )?.flagIcon;
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
      case TRANSFER_OM_INTERNATIONAL_COUNTRIES[0].callId: // Côte d'Ivoire
        return phoneNumber.length === 10;
      case TRANSFER_OM_INTERNATIONAL_COUNTRIES[1].callId: // Burkina
      case TRANSFER_OM_INTERNATIONAL_COUNTRIES[2].callId: // Mali
      case TRANSFER_OM_INTERNATIONAL_COUNTRIES[3].callId: // Niger
        return phoneNumber.length === 8;
      case TRANSFER_OM_INTERNATIONAL_COUNTRIES[4].callId: // Bissau
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

    if (this.otherBeneficiaryNumber && this.recipientContactInfos) {
      this.recipientNumber = this.otherBeneficiaryNumber;
      const payload = {
        senderMsisdn: '',
        recipientMsisdn: this.recipientNumber,
        recipientName: this.firstName + ' ' + this.lastName,
        country: this.country,
      };
      const pageData = Object.assign(payload, {
        purchaseType: OPERATION_TYPE_INTERNATIONAL_TRANSFER,
      });
      this.modalController.dismiss(pageData);
      this.appRouting.goSetTransferAmountPage(pageData);
    } else if (
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
        recipientName: '',
        country: this.country,
      };
      const pageData = Object.assign(payload, {
        purchaseType: OPERATION_TYPE_INTERNATIONAL_TRANSFER,
      });
      this.modalController.dismiss(pageData);
      this.appRouting.goSetTransferAmountPage(pageData);
    } else if (recentNumber) {
      const payload = {
        senderMsisdn: '',
        recipientMsisdn: recentNumber,
        recipientName: '',
        country: this.country,
      };
      const pageData = Object.assign(payload, {
        purchaseType: OPERATION_TYPE_INTERNATIONAL_TRANSFER,
      });
      this.modalController.dismiss(pageData);
      this.appRouting.goSetTransferAmountPage(pageData);
    } else {
      this.hasErrorGetContact = true;
      this.errorGetContact =
        'Le format du numéro est incorrect, veuillez réessayer';
    }
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
      component: SelectIrtRecipientPopupComponent,
      cssClass: 'select-recipient-modal',
      componentProps: {
        country,
      },
    });
    return await modal.present();
  }
}
