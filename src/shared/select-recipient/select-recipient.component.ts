import { OnInit, EventEmitter, Output, Component } from '@angular/core';
import { REGEX_NUMBER, formatPhoneNumber } from '..';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { Contacts, Contact } from '@ionic-native/contacts';
import { MatDialog } from '@angular/material';
import { SelectNumberPopupComponent } from '../select-number-popup/select-number-popup.component';

@Component({
  selector: 'app-select-recipient',
  templateUrl: './select-recipient.component.html',
  styleUrls: ['./select-recipient.component.scss']
})
export class SelectRecipientComponent implements OnInit {
  otherDestinataire = false;
  userNumber = this.dashServ.getCurrentPhoneNumber();
  destNumber = this.userNumber;
  destNumberValid = false;
  @Output() getDestinataire = new EventEmitter();
  @Output() getContact = new EventEmitter();
  showErrorMsg;
  contactInfos: any;

  constructor(
    private dashServ: DashboardService,
    private authenticationService: AuthenticationService,
    private contacts: Contacts,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  pickContact() {
    // const testContacts = [{ value: '77 133 12 25' }, { value: '77 133 12 26' }];
    // this.openPickRecipientModal(testContacts);
    this.contacts
      .pickContact()
      .then((contact: Contact) => {
        this.contactInfos = contact;
        if (contact.phoneNumbers.length > 1) {
          this.openPickRecipientModal(contact.phoneNumbers);
        } else {
          this.destNumber = formatPhoneNumber(contact.phoneNumbers[0].value);
          console.log(this.destNumber);
          if (this.validateNumber(this.destNumber)) {
            // this.getDestinataire.emit(this.destNumber);
            this.goToListPassStep();
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
        // this.getDestinataire.emit(this.destNumber);
        this.goToListPassStep();
      } else {
        this.destNumber = '';
        this.showErrorMsg = true;
      }
    });
  }

  setMeDestinataire() {
    // Get local user number
    this.destNumber = this.userNumber;
    // variable used for applying css and show or hide next btn
    this.otherDestinataire = false;
    this.getDestinataire.emit(this.destNumber);
  }

  setOtherDestinataire() {
    // variable used for applying css and show or hide next btn
    this.otherDestinataire = true;
    // Vider le champ de saisie
    this.destNumber = '';
  }

  validateNumber(phoneNumber: string) {
    return REGEX_NUMBER.test(phoneNumber);
  }

  enableNextBtn(destNumberEntered: string) {
    if (this.validateNumber(destNumberEntered)) {
      this.destNumberValid = true;
      this.destNumber = formatPhoneNumber(destNumberEntered);
    } else {
      this.destNumberValid = false;
    }
  }

  goToListPassStep() {
    this.destNumber = formatPhoneNumber(this.destNumber);
    this.authenticationService
      .isPostpaid(this.destNumber)
      .subscribe((isPostpaid: boolean) => {
        if (isPostpaid) {
          this.showErrorMsg = true;
        } else {
          this.getDestinataire.emit(this.destNumber);
          this.getContact.emit(this.contactInfos);
        }
      });
  }
}
