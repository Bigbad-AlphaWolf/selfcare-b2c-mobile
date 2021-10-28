import {OnInit, EventEmitter, Output, Component, Input} from '@angular/core';
import {
  REGEX_NUMBER,
  formatPhoneNumber,
  REGEX_FIX_NUMBER,
  SubscriptionModel,
  CODE_KIRENE_Formule,
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TYPE_PASS_ILLIMIX,
  parseIntoNationalNumberFormat
} from '..';
import {DashboardService} from 'src/app/services/dashboard-service/dashboard.service';
import {AuthenticationService} from 'src/app/services/authentication-service/authentication.service';
import {Contacts, Contact} from '@ionic-native/contacts';
import {MatDialog} from '@angular/material/dialog';
import {SelectNumberPopupComponent} from '../select-number-popup/select-number-popup.component';
import {PROFILE_TYPE_POSTPAID, CODE_FORMULE_KILIMANJARO, KILIMANJARO_FORMULE} from 'src/app/dashboard';

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
  @Input() purchaseType;
  showErrorMsg;
  contactInfos: any;
  isProcessing: boolean;
  eligibilityChecked: boolean;
  isRecipientEligible: boolean;
  eligibilityError: string;
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
      data: {phoneNumbers}
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
    this.isProcessing = true;
    // variable used for applying css and show or hide next btn
    this.otherDestinataire = false;
    const formatedNumber = parseIntoNationalNumberFormat(this.destNumber);
    this.authenticationService.getSubscription(this.destNumber).subscribe(async (res: SubscriptionModel) => {
      this.isProcessing = false;
      if (res.code === CODE_KIRENE_Formule && this.purchaseType === OPERATION_TYPE_PASS_ILLIMIX) {
        const eligibility = await this.isEligible(formatedNumber);
        if (eligibility && !eligibility.eligible) return;
      }
      this.getDestinataire.emit({
        destinataire: this.destNumber,
        code: res.code
      });
    });
  }

  async isEligible(destNumber: string) {
    this.isProcessing = true;
    let isEligible: any = await this.authenticationService.checkUserEligibility(destNumber).toPromise();
    this.isProcessing = false;
    this.eligibilityChecked = true;
    if (isEligible && !isEligible.eligible) {
      this.isRecipientEligible = false;
      this.eligibilityError = isEligible.message;
    }
    return isEligible;
  }

  setOtherDestinataire() {
    // variable used for applying css and show or hide next btn
    this.otherDestinataire = true;
    // Vider le champ de saisie
    this.destNumber = '';
    this.isRecipientEligible = true;
  }

  validateNumber(phoneNumber: string) {
    return REGEX_NUMBER.test(phoneNumber) || REGEX_FIX_NUMBER.test(phoneNumber);
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
    this.showErrorMsg = false;
    this.isProcessing = true;
    this.destNumber = formatPhoneNumber(this.destNumber);
    const formatedNumber = parseIntoNationalNumberFormat(this.destNumber);
    this.authenticationService.getSubscriptionForTiers(formatedNumber).subscribe(
      async (res: SubscriptionModel) => {
        this.isProcessing = false;
        if (res.profil === PROFILE_TYPE_POSTPAID && res.code !== KILIMANJARO_FORMULE) {
          this.showErrorMsg = true;
          return;
        } else if (res.code === CODE_KIRENE_Formule && this.purchaseType === OPERATION_TYPE_PASS_ILLIMIX) {
          const eligibility = await this.isEligible(formatedNumber);
          if (eligibility && !eligibility.eligible) return;
        }
        this.getDestinataire.emit({
          destinataire: this.destNumber,
          code: res.code
        });
        if (this.contactInfos) {
          this.getContact.emit(this.contactInfos);
        }
      },
      () => {
        this.isProcessing = false;
      }
    );
  }
}
