import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material';
import { NoOMAccountPopupComponent } from 'src/shared/no-omaccount-popup/no-omaccount-popup.component';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import {
  REGEX_NUMBER,
  CREDIT,
  BONUS,
  REGEX_NUMBER_OM,
  formatPhoneNumber,
  parseIntoNationalNumberFormat,
} from 'src/shared';
import { Contacts, Contact } from '@ionic-native/contacts';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { SelectNumberPopupComponent } from 'src/shared/select-number-popup/select-number-popup.component';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { ModalController, NavController } from '@ionic/angular';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-transfer-recipient-amount',
  templateUrl: './transfer-recipient-amount.component.html',
  styleUrls: ['./transfer-recipient-amount.component.scss'],
})
export class TransferRecipientAmountComponent implements OnInit, OnChanges {
  formAmount: FormGroup = null;
  formDest: FormGroup = null;
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
  showErrorAmount: boolean;
  checkingOMAmountToTransfer: boolean;
  userCurrentNumber: string;
  omPhoneNumber: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private omService: OrangeMoneyService,
    private contacts: Contacts,
    private dashService: DashboardService,
    private followAnalytics: FollowAnalyticsService,
    private pinpadOM: ModalController,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.userCurrentNumber = this.dashService.getCurrentPhoneNumber();
    if (this.orangeMoney) {
      this.formAmount = this.formBuilder.group({
        amount: [
          '',
          [Validators.required, Validators.min(1), Validators.max(2000000)],
        ],
      });
      this.formDest = this.formBuilder.group({
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(REGEX_NUMBER_OM)],
        ],
      });
      this.getOmPhoneNumber();
    } else {
      this.formAmount = this.formBuilder.group({
        amount: ['', [Validators.required, Validators.min(100)]],
      });
      this.formDest = this.formBuilder.group({
        phoneNumber: [
          '',
          [Validators.required, Validators.pattern(REGEX_NUMBER)],
        ],
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.consoDetails && changes.consoDetails.currentValue) {
      if (this.orangeMoney) {
        this.formAmount = this.formBuilder.group({
          amount: [
            '',
            [Validators.required, Validators.min(1), Validators.max(2000000)],
          ],
        });
        this.formDest = this.formBuilder.group({
          phoneNumber: [
            '',
            [Validators.required, Validators.pattern(REGEX_NUMBER_OM)],
          ],
        });
        this.getOmPhoneNumber();
      } else {
        this.formAmount = this.formBuilder.group({
          amount: ['', [Validators.required, Validators.min(100)]],
        });
        this.formDest = this.formBuilder.group({
          phoneNumber: [
            '',
            [Validators.required, Validators.pattern(REGEX_NUMBER)],
          ],
        });
      }
    }
  }

  openModalNoOMAccount(recipientInfos: {
    phoneNumber: string;
    hasOMAccount: boolean;
  }) {
    this.noOMAccountModal = this.dialog.open(NoOMAccountPopupComponent, {
      disableClose: true,
      data: { pageDesktop: false, otherDestinataire: true },
    });
    this.noOMAccountModal.afterClosed().subscribe((accepted) => {
      if (accepted) {
        this.nextStepEmitter.emit(recipientInfos);
        this.contactEmitter.emit(this.contactInfos);
      }
    });
  }

  getOmPhoneNumber() {
    this.omService.getOmMsisdn().subscribe((msisdn) => {
      if (msisdn !== 'error') {
        this.omPhoneNumber = msisdn;
        this.checkOMToken(msisdn);
      } else {
        this.openPinpad();
      }
    });
  }

  async openPinpad() {
    const modal = await this.pinpadOM.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: null,
      },
    });
    modal.onDidDismiss().then((res: any) => {
      if (res.data && res.data.balance) {
        this.omBalanceVisible = true;
        this.omBalance = res.data.balance;
      }
    });
    return await modal.present();
  }

  suivant() {
    if (this.step === 'SAISIE_MONTANT') {
      const amount = this.formAmount.value.amount;
      if (this.orangeMoney) {
        this.checkingOMAmountToTransfer = true;
        this.showErrorAmount = false;
        this.omService.checkBalanceSufficiency(amount).subscribe(
          (hasEnoughBalance) => {
            this.checkingOMAmountToTransfer = false;
            if (hasEnoughBalance) {
              this.nextStepEmitter.emit(amount);
            } else {
              this.showErrorAmount = true;
            }
          },
          () => {
            this.checkingOMAmountToTransfer = false;
            this.nextStepEmitter.emit(amount);
          }
        );
      } else {
        this.nextStepEmitter.emit(amount);
      }
    }
    if (this.step === 'SAISIE_NUMBER') {
      const recipient = {
        phoneNumber: formatPhoneNumber(this.formDest.value.phoneNumber),
        hasOMAccount: false,
      };
      this.errorMsg = '';
      if (this.orangeMoney) {
        this.contactInfos = null;
        this.checkRecipientHasOMAccount(this.formDest.value.phoneNumber);
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
    this.openPinpad();
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
      .then(async (contact: Contact) => {
        this.contactInfos = contact;
        if (contact.phoneNumbers.length > 1) {
          this.openPickRecipientModal(contact);
        } else {
          const destNumber = formatPhoneNumber(contact.phoneNumbers[0].value);
          this.processSelectedNumber(destNumber, contact);
        }
      })
      .catch(() => {});
  }

  async processSelectedNumber(selectedNumber: string, contact?: any) {
    if (this.validateNumber(selectedNumber)) {
      this.recipientInfos.phoneNumber =
        parseIntoNationalNumberFormat(selectedNumber);
      this.formDest.setValue({ phoneNumber: this.recipientInfos.phoneNumber });
      if (this.orangeMoney) {
        this.checkRecipientHasOMAccount(this.formDest.value.phoneNumber);
      } else {
        if (
          await this.checkRecipientCanRecieveCredit(
            this.recipientInfos.phoneNumber
          )
        ) {
          this.nextStepEmitter.emit(this.recipientInfos);
          this.contactEmitter.emit(contact);
        } else {
          this.badNumberStep();
        }
      }
    } else {
      this.badNumberStep();
    }
  }

  async checkRecipientCanRecieveCredit(msisdn) {
    let canRecieve = await this.authService
      .canRecieveCredit(msisdn)
      .toPromise();
    return canRecieve;
  }

  openPickRecipientModal(contact: any) {
    const dialogRef = this.dialog.open(SelectNumberPopupComponent, {
      data: { phoneNumbers: contact.phoneNumbers },
    });
    dialogRef.afterClosed().subscribe((selectedNumber: string) => {
      if (selectedNumber) {
        selectedNumber = formatPhoneNumber(selectedNumber);
        this.processSelectedNumber(selectedNumber, contact);
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

  checkOMToken(phoneNumber: string) {
    this.omService.GetUserAuthInfo(phoneNumber).subscribe((omUser: any) => {
      // If user already connected open pinpad
      if (!omUser.hasApiKey || omUser.loginExpired) {
        this.openPinpad();
      }
    });
  }

  checkRecipientHasOMAccount(selectedNumber: string) {
    this.checkingOMAccount = true;
    const phoneNumber = formatPhoneNumber(selectedNumber);
    this.recipientInfos = {
      phoneNumber,
      hasOMAccount: false,
    };
    this.omService
      .checkUserHasAccount(this.recipientInfos.phoneNumber)
      .subscribe(
        (hasOMAccount: boolean) => {
          this.checkingOMAccount = false;
          if (hasOMAccount) {
            this.recipientInfos.hasOMAccount = true;
            this.nextStepEmitter.emit(this.recipientInfos);
            if (this.contactInfos) {
              this.contactEmitter.emit(this.contactInfos);
            }
            this.followAnalytics.registerEventFollow(
              'destinataire_transfert_has_om_account_success',
              'event',
              {
                transfert_om_numero_sender: this.userCurrentNumber,
                transfert_om_numero_receiver: this.recipientInfos.phoneNumber,
                has_om: 'true',
              }
            );
          } else {
            this.followAnalytics.registerEventFollow(
              'destinataire_transfert_has_om_account_success',
              'event',
              {
                transfert_om_numero_sender: this.userCurrentNumber,
                transfert_om_numero_receiver: this.recipientInfos.phoneNumber,
                has_om: 'false',
              }
            );
            this.openModalNoOMAccount(this.recipientInfos);
          }
        },
        (err) => {
          this.checkingOMAccount = false;
          if (err.status === 400) {
            this.openModalNoOMAccount(this.recipientInfos);
            this.followAnalytics.registerEventFollow(
              'destinataire_transfert_has_om_account',
              'event',
              {
                transfert_om_numero_destinataire:
                  this.recipientInfos.phoneNumber,
                has_om: 'false',
              }
            );
          } else {
            this.followAnalytics.registerEventFollow(
              'destinataire_transfert_has_om_account_error',
              'error',
              {
                transfert_om_numero_sender: this.userCurrentNumber,
                transfert_om_numero_receiver: this.recipientInfos.phoneNumber,
                error: 'Une error ' + err.status + ' est survenue',
              }
            );
            this.errorMsg = 'Une erreur est survenue, veuillez reessayer';
          }
        }
      );
  }

  async resetOmToken(err) {
    const modal = await this.pinpadOM.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: null,
      },
    });
    await modal.present();
    let result = await modal.onDidDismiss();
    if (result && result.data && result.data.success) return of(err);
    throw new HttpErrorResponse({
      error: { title: 'Ping pad cancled' },
      status: 401,
    });
  }
}
