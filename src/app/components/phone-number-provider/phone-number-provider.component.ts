import {
  Component,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { formatPhoneNumber, REGEX_NUMBER_OM } from "src/shared";
import { SelectNumberPopupComponent } from "src/shared/select-number-popup/select-number-popup.component";
import { Contacts, Contact } from "@ionic-native/contacts";
import { MatDialog } from "@angular/material";
import { OperationInfos } from 'src/app/models/operation-infos.model';

@Component({
  selector: "oem-phone-number-provider",
  templateUrl: "./phone-number-provider.component.html",
  styleUrls: ["./phone-number-provider.component.scss"],
})
export class PhoneNumberProviderComponent implements OnInit {
  @Output("onPhoneSelected") onPhoneSelected: EventEmitter<
  OperationInfos
  > = new EventEmitter();


  hasErrorGetContact: boolean;
  errorGetContact: any;
  otherBeneficiaryNumber ='';
  recipientContactInfos = '';
  
  contactDisplay:OperationInfos={};
  constructor(
    private dialog: MatDialog,
    private contacts: Contacts
  ) {}

  ngOnInit() {
  }
  onValueChange(value?:any) {

    this.onPhoneSelected.emit({recipientMsisdn:value});
  }

  pickContact() {
    this.hasErrorGetContact = false;
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
        console.log("err", err);
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
      this.contactDisplay.recipientMsisdn = this.otherBeneficiaryNumber;
      this.onPhoneSelected.emit(this.contactDisplay);

    } else {
      this.hasErrorGetContact = true;
      this.errorGetContact =
        "Veuillez choisir un numéro de destinataire valide pour continuer";
    }
  }

  validateNumber(phoneNumber: string) {
    return REGEX_NUMBER_OM.test(phoneNumber);
  }

  getContactFormattedName(contact: any) {
    const givenName = contact.name.givenName;
    const familyName = contact.name.familyName ? contact.name.familyName : "";

    this.recipientContactInfos =
      contact.name && contact.name.formatted
        ? contact.name.formatted
        : givenName + " " + familyName;
    
        this.contactDisplay.recipientFirstname = givenName;
        this.contactDisplay.recipientLastname = familyName;
  }
}
