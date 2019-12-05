import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { REGEX_NUMBER, formatPhoneNumber, REGEX_NAME } from 'src/shared';
import { ModalController } from '@ionic/angular';
import { ParrainageService } from 'src/app/services/parrainage-service/parrainage.service';
import { Contacts, Contact } from '@ionic-native/contacts';
import { MatDialog } from '@angular/material';
import { SelectNumberPopupComponent } from 'src/shared/select-number-popup/select-number-popup.component';

@Component({
  selector: 'app-create-sponsor-form',
  templateUrl: './create-sponsor-form.component.html',
  styleUrls: ['./create-sponsor-form.component.scss']
})
export class CreateSponsorFormComponent implements OnInit {
  form: FormGroup;
  creatingSponsee = false;
  showErrMessage = false;
  showSuccessMessage = false;
  errorMsg: string;
  destNumber: string;
  contact: Contact;
  constructor(
    private fb: FormBuilder,
    public modalController: ModalController,
    private parrainageService: ParrainageService,
    private contacts: Contacts,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      sponseeMsisdn: [
        '',
        [Validators.required, Validators.pattern(REGEX_NUMBER)]
      ],
      firstname: ['', [Validators.pattern(REGEX_NAME)]]
    });
  }

  pickContact() {
    this.showErrMessage = false;
    this.contacts
      .pickContact()
      .then((contact: Contact) => {
        this.contact = contact;
        if (contact.phoneNumbers.length > 1) {
          this.openPickRecipientModal(contact.phoneNumbers);
        } else {
          this.destNumber = formatPhoneNumber(contact.phoneNumbers[0].value);
          if (this.validateNumber(this.destNumber)) {
            this.contactGot();
          } else {
            this.destNumber = '';
            this.showErrMessage = true;
            this.errorMsg = 'Le numéro choisi n’est pas correct';
          }
        }
      })
      .catch(err => {});
  }

  openPickRecipientModal(phoneNumbers: any[]) {
    this.showErrMessage = false;
    const dialogRef = this.dialog.open(SelectNumberPopupComponent, {
      data: { phoneNumbers }
    });
    dialogRef.afterClosed().subscribe(selectedNumber => {
      this.destNumber = formatPhoneNumber(selectedNumber);
      if (this.validateNumber(this.destNumber)) {
        this.contactGot();
      } else {
        this.destNumber = '';
        this.showErrMessage = true;
        this.errorMsg = 'Le numéro choisi n’est pas correct';
      }
    });
  }

  contactGot() {
    let recipientFirstName = this.contact.name.givenName;
    const recipientLastName = this.contact.name.familyName
      ? this.contact.name.familyName
      : '';
    recipientFirstName += this.contact.name.middleName
      ? ` ${this.contact.name.middleName}`
      : '';
    const name = `${recipientFirstName} ${recipientLastName}`;
    this.form.setValue({ sponseeMsisdn: this.destNumber, firstname: name });
  }

  validateNumber(phoneNumber: string) {
    return REGEX_NUMBER.test(phoneNumber);
  }

  createSponsee() {
    this.showErrMessage = false;
    this.showSuccessMessage = false;
    this.creatingSponsee = true;
    const msisdn = this.form.value.sponseeMsisdn;
    const firstName = this.form.value.firstname;
    this.parrainageService.createSponsee({ msisdn, firstName }).subscribe(
      (res: any) => {
        this.creatingSponsee = false;
        this.showSuccessMessage = true;
        this.form.reset();
        this.closeModal();
      },
      (err: any) => {
        this.creatingSponsee = false;
        this.showErrMessage = true;
        if (err && err.status === 400 && err.error.title) {
          this.errorMsg = err.error.title;
        } else {
          this.errorMsg = 'Une erreur est survenue';
        }
      }
    );
  }

  closeModal() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
