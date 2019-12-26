import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { NoOMAccountPopupComponent } from 'src/shared/no-omaccount-popup/no-omaccount-popup.component';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import {
  REGEX_NUMBER,
  CREDIT,
  BONUS,
  REGEX_NUMBER_OM,
  formatPhoneNumber
} from 'src/shared';
import { Contacts, Contact } from '@ionic-native/contacts';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { SelectNumberPopupComponent } from 'src/shared/select-number-popup/select-number-popup.component';

@Component({
  selector: 'app-transfer-recipient-amount',
  templateUrl: './transfer-recipient-amount.component.html',
  styleUrls: ['./transfer-recipient-amount.component.scss']
})
export class TransferRecipientAmountComponent implements OnInit {
  formAmount: FormGroup;
  formDest: FormGroup;
  @Input() step = 'SAISIE_MONTANT';
  @Input() type;
  @Output() nextStepEmitter = new EventEmitter();
  @Output() contactEmitter = new EventEmitter();
  @Input() SoldeType;
  @Input() solderechargement = 0;
  @Input() soldebonusverorange = 0;
  @Input() soldebonustoutesdest = 0;
  @Input() errorMsg = '';
  @Input() orangeMoney: boolean;
  @Input() showErrorMsg: boolean;
  omBalanceVisible = false;
  omBalance;
  typeOMCode = false;
  operationOM: 'CHECK_SOLDE' | 'RESET_TOKEN' = 'CHECK_SOLDE';
  noOMAccountModal: MatDialogRef<NoOMAccountPopupComponent, any>;
  checkingOMAccount = false;
  recipientInfos = { phoneNumber: '', hasOMAccount: false };
  contactInfos: any;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private omService: OrangeMoneyService,
    private contacts: Contacts,
    private dashService: DashboardService
  ) {}

  ngOnInit() {
    if (this.orangeMoney) {
      this.formAmount = this.formBuilder.group({
        amount: [
          '',
          [Validators.required, Validators.min(1), Validators.max(2000000)]
        ]
      });
      this.formDest = this.formBuilder.group({
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(REGEX_NUMBER_OM)]
        ]
      });
      this.checkOMToken();
    } else {
      this.formAmount = this.formBuilder.group({
        amount: ['', [Validators.required, Validators.min(100)]]
      });
      this.formDest = this.formBuilder.group({
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(REGEX_NUMBER)]
        ]
      });
    }
  }

  openModalNoOMAccount(recipientInfos: {
    phoneNumber: string;
    hasOMAccount: boolean;
  }) {
    this.noOMAccountModal = this.dialog.open(NoOMAccountPopupComponent, {
      disableClose: true,
      data: { pageDesktop: false, otherDestinataire: true }
    });
    this.noOMAccountModal.afterClosed().subscribe(accepted => {
      if (accepted) {
        this.nextStepEmitter.emit(recipientInfos);
        this.contactEmitter.emit(this.contactInfos);
      }
    });
  }

  suivant() {
    if (this.step === 'SAISIE_MONTANT') {
      this.nextStepEmitter.emit(this.formAmount.value.amount);
    }
    if (this.step === 'SAISIE_NUMBER') {
      const recipient = {
        phoneNumber: formatPhoneNumber(this.formDest.value.phoneNumber),
        hasOMAccount: false
      };
      this.errorMsg = '';
      if (this.orangeMoney) {
        this.contactInfos = null;
        this.checkRecipientHasOMAccount();
      } else {
        this.nextStepEmitter.emit(recipient);
      }
    }
  }

  getCredit() {
    return CREDIT;
  }

  getBonus() {
    return BONUS;
  }

  seeSolde() {
    this.typeOMCode = true;
  }

  soldeGot(solde) {
    this.typeOMCode = false;
    if (solde !== 'erreur') {
      if (this.operationOM !== 'RESET_TOKEN') {
        this.omBalanceVisible = true;
        this.omBalance = solde;
      }
    }
  }

  hideSolde() {
    this.omBalanceVisible = false;
  }

  pickContact() {
    this.showErrorMsg = false;
    this.contactInfos = null;
    // this comment is useful in the case you want test multi phone numbers contacts in the navigator
    // const testContacts = [{ value: '771331225' }, { value: '771331226' }];
    // this.openPickRecipientModal(testContacts);
    this.contacts
      .pickContact()
      .then((contact: Contact) => {
        this.contactInfos = contact;
        if (contact.phoneNumbers.length > 1) {
          this.openPickRecipientModal(contact.phoneNumbers);
        } else {
          const destNumber = formatPhoneNumber(contact.phoneNumbers[0].value);
          this.recipientInfos.phoneNumber = destNumber;
          this.formDest.setValue({ phoneNumber: destNumber });
          if (this.orangeMoney) {
            if (this.validateNumberOm(destNumber)) {
              // this.contactEmitter.emit(contact);
              this.checkRecipientHasOMAccount();
            } else {
              this.badNumberStep();
            }
          } else {
            if (this.validateNumber(destNumber)) {
              this.nextStepEmitter.emit(this.recipientInfos);
              this.contactEmitter.emit(contact);
            } else {
              this.badNumberStep();
            }
          }
        }
      })
      .catch(err => {});
  }

  openPickRecipientModal(phoneNumbers: any[]) {
    const dialogRef = this.dialog.open(SelectNumberPopupComponent, {
      data: { phoneNumbers }
    });
    dialogRef.afterClosed().subscribe((selectedNumber: string) => {
      if (selectedNumber) {
        selectedNumber = formatPhoneNumber(selectedNumber);
        this.recipientInfos.phoneNumber = selectedNumber;
        this.formDest.setValue({ phoneNumber: selectedNumber });
        if (this.orangeMoney) {
          this.checkRecipientHasOMAccount();
        } else {
          this.nextStepEmitter.emit(this.recipientInfos);
          this.contactEmitter.emit(this.contactInfos);
        }
      }
    });
  }

  badNumberStep() {
    this.formDest.value.phoneNumber = '';
    this.showErrorMsg = true;
    this.errorMsg = 'Ce numéro ne peut pas bénéficier du transfert';
  }

  validateNumber(phoneNumber: string) {
    return REGEX_NUMBER.test(phoneNumber);
  }

  validateNumberOm(phoneNumber: string) {
    return REGEX_NUMBER_OM.test(phoneNumber);
  }

  checkOMToken() {
    const phoneNumber = this.dashService.getCurrentPhoneNumber();
    this.omService.GetUserAuthInfo(phoneNumber).subscribe((omUser: any) => {
      // If user already connected open pinpad
      if (!omUser.hasApiKey || omUser.loginExpired || !omUser.accessToken) {
        this.operationOM = 'RESET_TOKEN';
        this.typeOMCode = true;
      }
    });
  }

  checkRecipientHasOMAccount() {
    this.checkingOMAccount = true;
    const phoneNumber = formatPhoneNumber(this.formDest.value.phoneNumber);
    this.recipientInfos = {
      phoneNumber,
      hasOMAccount: false
    };
    this.omService
      .checkUserHasAccount(this.recipientInfos.phoneNumber)
      .subscribe(
        (res: any) => {
          this.checkingOMAccount = false;
          if (res) {
            if (res.status_code.match('Success')) {
              this.recipientInfos.hasOMAccount = true;
              this.nextStepEmitter.emit(this.recipientInfos);
              if (this.contactInfos) {
                this.contactEmitter.emit(this.contactInfos);
              }
            } else {
              this.openModalNoOMAccount(this.recipientInfos);
            }
          } else {
            this.operationOM = 'RESET_TOKEN';
            this.typeOMCode = true;
          }
        },
        err => {
          this.checkingOMAccount = false;
          if (err.status === 400) {
            this.openModalNoOMAccount(this.recipientInfos);
          } else {
            this.errorMsg = 'Une erreur est survenue, veuillez reessayer';
          }
        }
      );
  }
}
