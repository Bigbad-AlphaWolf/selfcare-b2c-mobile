import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef
} from '@angular/core';
import { formatPhoneNumber, parseIntoNationalNumberFormat, REGEX_NUMBER_OM } from 'src/shared';
import { SelectNumberPopupComponent } from 'src/shared/select-number-popup/select-number-popup.component';
import { Contacts, Contact } from '@ionic-native/contacts';
import { MatDialog, MatInput } from '@angular/material';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

@Component({
  selector: 'oem-phone-number-provider',
  templateUrl: './phone-number-provider.component.html',
  styleUrls: ['./phone-number-provider.component.scss']
})
export class PhoneNumberProviderComponent implements OnInit, OnChanges {
  @Output('onPhoneSelected') onPhoneSelected: EventEmitter<OperationExtras> = new EventEmitter();
  @Input() showInput: boolean;
  @ViewChild('numberInput') input: ElementRef;
  hasErrorGetContact: boolean;
  errorGetContact: any;
  otherBeneficiaryNumber = '';
  recipientContactInfos = '';

  opXtras: OperationExtras = {};
  constructor(
    private dialog: MatDialog,
    private contacts: Contacts,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes.showInput.currentValue) {
      setTimeout(() => {
        this.input.nativeElement.focus();
      }, 5);
    }
  }

  ngOnInit() {}
  onValueChange(value?: any) {
    this.onPhoneSelected.emit({ recipientMsisdn: value });
  }

  pickContact() {
    this.followAnalyticsService.registerEventFollow('Access_contacts', 'event');
    this.hasErrorGetContact = false;
    this.errorGetContact = null;
    this.contacts
      .pickContact()
      .then((contact: Contact) => {
        if (contact.phoneNumbers.length > 1) {
          this.openPickRecipientModal(contact);
        } else {
          const selectedNumber = formatPhoneNumber(contact.phoneNumbers[0].value);
          this.processGetContactInfos(contact, selectedNumber);
        }
      })
      .catch(err => {
        console.log('err', err);
      });
  }

  openPickRecipientModal(contact: any) {
    const dialogRef = this.dialog.open(SelectNumberPopupComponent, {
      data: { phoneNumbers: contact.phoneNumbers }
    });
    dialogRef.afterClosed().subscribe(selectedNumber => {
      const choosedNumber = formatPhoneNumber(selectedNumber);
      this.processGetContactInfos(contact, choosedNumber);
    });
  }

  processGetContactInfos(contact: any, selectedNumber: any) {
    if (this.validateNumber(selectedNumber)) {
      const formatedNumber = parseIntoNationalNumberFormat(selectedNumber);
      this.otherBeneficiaryNumber = formatedNumber;
      this.getContactFormattedName(contact);
      this.opXtras.recipientMsisdn = this.otherBeneficiaryNumber;
      this.opXtras.recipientFromContact = true;
      this.onPhoneSelected.emit(this.opXtras);
    } else {
      this.hasErrorGetContact = true;
      this.errorGetContact = `Veuillez choisir un numéro de destinataire valide pour continuer. Numéro Selectionné: ${selectedNumber} `;
    }
  }

  validateNumber(phoneNumber: string) {
    return REGEX_NUMBER_OM.test(phoneNumber);
  }

  getContactFormattedName(contact: any) {
    const givenName = contact.name.givenName;
    const familyName = contact.name.familyName ? contact.name.familyName : '';

    this.recipientContactInfos =
      contact.name && contact.name.formatted ? contact.name.formatted : givenName + ' ' + familyName;

    this.opXtras.recipientName = this.recipientContactInfos;
    this.opXtras.recipientFirstname = givenName;
    this.opXtras.recipientLastname = familyName;
  }
}
