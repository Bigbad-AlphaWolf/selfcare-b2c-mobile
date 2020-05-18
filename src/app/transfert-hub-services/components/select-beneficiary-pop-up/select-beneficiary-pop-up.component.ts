import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { SelectNumberPopupComponent } from 'src/shared/select-number-popup/select-number-popup.component';
import { formatPhoneNumber, REGEX_NUMBER_OM } from 'src/shared';
import { MatDialog, MatInput, MatFormField } from '@angular/material';
import { Contacts, Contact } from '@ionic-native/contacts';
import { IonInput, ModalController } from '@ionic/angular';

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
  lastName; string;
  @ViewChild('inputTel') htmlInput: ElementRef;

  constructor(private dialog: MatDialog,private contacts: Contacts, private modalController: ModalController) { }

  ngOnInit() {}

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
            const selectedNumber = formatPhoneNumber(contact.phoneNumbers[0].value);
            this.processGetContactInfos(contact,selectedNumber);
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

  processGetContactInfos(contact: any, selectedNumber: any){
    if (this.validateNumber(selectedNumber)) {
      this.otherBeneficiaryNumber = selectedNumber;
      this.getContactFormattedName(contact);

    } else {
      this.hasErrorGetContact = true;
      this.errorGetContact = "Veuillez choisir un numéro de destinataire valide pour continuer"
    }
  }

  validateNumber(phoneNumber: string) {
    return REGEX_NUMBER_OM.test(phoneNumber);
  }

  getContactFormattedName(contact: any) {
    const givenName = contact.name.givenName;
    const familyName = contact.name.familyName ? contact.name.familyName : '';
    const middleName = contact.name.middleName ? ` ${contact.name.middleName}` : '';
    this.recipientContactInfos = contact.name && contact.name.formatted ? contact.name.formatted : givenName + " " + familyName;
    this.firstName = givenName;
    this.lastName = familyName;    

  }

  validateBeneficiary(){
    this.hasErrorGetContact = false;
    this.errorGetContact = null;
    
    if(this.htmlInput && this.htmlInput.nativeElement.value && this.validateNumber(this.htmlInput.nativeElement.value)){
      this.recipientNumber = formatPhoneNumber(this.htmlInput.nativeElement.value);
      console.log('OK', this.recipientNumber);
      this.modalController.dismiss({
        'recipientMsisdn': this.recipientNumber,
        'recipientFirstname': this.firstName,
        'recipientLastname': this.lastName
      });
    }else if(this.otherBeneficiaryNumber && this.recipientContactInfos){
      this.recipientNumber = this.otherBeneficiaryNumber;
      console.log('OK', this.recipientNumber, this.recipientContactInfos);
      this.modalController.dismiss({
        'recipientMsisdn': this.recipientNumber,
        'recipientFirstname': this.firstName,
        'recipientLastname': this.lastName
      });
    } else{
      this.hasErrorGetContact = true;
      this.errorGetContact = "Veuillez choisir un numéro de destinataire valide pour continuer"
    }
  }

}
