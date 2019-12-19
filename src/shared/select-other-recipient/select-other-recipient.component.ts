import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { REGEX_NUMBER, formatPhoneNumber, REGEX_FIX_NUMBER } from '..';
import { MatDialog } from '@angular/material';
import { SelectNumberPopupComponent } from '../select-number-popup/select-number-popup.component';
import { Contacts, Contact } from '@ionic-native/contacts';

@Component({
  selector: 'app-select-other-recipient',
  templateUrl: './select-other-recipient.component.html',
  styleUrls: ['./select-other-recipient.component.scss']
})
export class SelectOtherRecipientComponent implements OnInit {
  formDest: FormGroup;
  @Input() type: 'credit' | 'pass';
  @Output() nextStepEmitter = new EventEmitter();
  showErrorMsg;
  destNumber: string;
  isValidNumber: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authServ: AuthenticationService,
    private contacts: Contacts,
    private dialog: MatDialog
  ) {
    this.formDest = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(REGEX_NUMBER)]]
    });
  }
  enableBtn(msisdn: string){
    this.isValidNumber = this.validateNumber(msisdn);
    console.log(this.isValidNumber);
    
  }

  ngOnInit() {}

  suivant() {
    this.showErrorMsg = false;
    this.destNumber = formatPhoneNumber(this.formDest.value.phoneNumber);
    this.authServ.isPostpaid(this.destNumber).subscribe((isPostpaid: any) => {
      if (isPostpaid) {
        this.showErrorMsg = true;
      } else {
        this.nextStepEmitter.emit(this.destNumber);
      }
    });
  }

  pickContact() {
    this.contacts
      .pickContact()
      .then((contact: Contact) => {
        if (contact.phoneNumbers.length > 1) {
          this.openPickRecipientModal(contact.phoneNumbers);
        } else {
          this.destNumber = formatPhoneNumber(contact.phoneNumbers[0].value);
          if (this.validateNumber(this.destNumber)) {
            this.nextStepEmitter.emit(this.destNumber);
          } else {
            this.destNumber = '';
            this.showErrorMsg = true;
          }
        }
      })
      .catch(err => {});
  }

  openPickRecipientModal(phoneNumbers: any[]) {
    const dialogRef = this.dialog.open(SelectNumberPopupComponent, {
      data: { phoneNumbers }
    });
    dialogRef.afterClosed().subscribe(selectedNumber => {
      this.destNumber = formatPhoneNumber(selectedNumber);
      if (this.validateNumber(this.destNumber)) {
        this.nextStepEmitter.emit(this.destNumber);
      } else {
        this.destNumber = '';
        this.showErrorMsg = true;
      }
    });
  }

  validateNumber(phoneNumber: string) {
    return REGEX_NUMBER.test(phoneNumber) || REGEX_FIX_NUMBER.test(phoneNumber);
  }
}
