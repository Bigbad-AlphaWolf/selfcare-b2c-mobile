import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  OPERATION_TYPE_SEDDO_CREDIT,
  OPERATION_TYPE_SEDDO_PASS,
  OPERATION_TYPE_SEDDO_BONUS,
  USER_CONS_CATEGORY_CALL,
  OPERATION_TYPE_TRANSFER_OM,
  PAYMENT_MOD_OM,
  PAYMENT_MOD_CREDIT,
  PAYMENT_MOD_BONUS,
  OPERATION_TRANSFER_OM_WITH_CODE,
  OPERATION_TRANSFER_OM
} from 'src/shared';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { getConsoByCategory } from '../dashboard';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { TransfertBonnus } from '../services/dashboard-service';
import { Contact } from '@ionic-native/contacts';

@Component({
  selector: 'app-transfer-credit-bonus-om',
  templateUrl: './transfer-credit-bonus-om.page.html',
  styleUrls: ['./transfer-credit-bonus-om.page.scss']
})
export class TransferCreditBonusOmPage implements OnInit {
  step = 'CHOOSE_TRANSFER';
  numberDestinatary = '';
  amount: number;
  transferType;
  transferOMType: string;
  paymentMode;
  loading;
  pinHasError;
  pinErrMsg;
  titleText = 'Veuillez saisir votre code PIN';
  compteur;
  OPERATION_TYPE_SEDDO_CREDIT = OPERATION_TYPE_SEDDO_CREDIT;
  OPERATION_TYPE_SEDDO_PASS = OPERATION_TYPE_SEDDO_PASS;
  solderechargement = 0;
  soldebonusverorange = 0;
  soldebonustoutesdest = 0;
  failed;
  type;
  errorMsg;
  operationType;
  transferOMWithCode: boolean;
  fees: { feeValue: number; payFee: boolean };
  omTransferPayload = { amount: 0, msisdn2: '', firstName: '', lastName: '' };
  firstName;
  lastName;
  payFee = false;
  isLoaded = false;
  recipientHasOMAccount: boolean;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private dialog: MatDialog,
    private authServ: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (this.route.snapshot) {
      this.operationType = this.route.snapshot.paramMap.get('type');
    }
    if (this.operationType === OPERATION_TYPE_TRANSFER_OM) {
      this.step = 'SAISIE_NUMBER';
      this.transferType = OPERATION_TYPE_TRANSFER_OM;
      this.paymentMode = PAYMENT_MOD_OM;
      this.isLoaded = true;
    } else {
      this.getSoldeRechargementAndBonus();
    }
  }

  setChoice(choice) {
    this.transferType = choice;
    if (choice === OPERATION_TYPE_SEDDO_BONUS) {
      this.paymentMode = PAYMENT_MOD_BONUS;
    } else if (choice === OPERATION_TYPE_SEDDO_CREDIT) {
      this.paymentMode = PAYMENT_MOD_CREDIT;
    }
    this.getSoldeCompteur();
    this.step = 'SAISIE_NUMBER';
  }

  getLabelStep(choice: string) {
    let label: string;
    switch (choice) {
      case OPERATION_TYPE_SEDDO_CREDIT:
        label = 'Crédit';
        break;
      case OPERATION_TYPE_SEDDO_BONUS:
        label = 'Bonus';
        break;
      default:
        break;
    }
    return label;
  }

  suivant(event) {
    switch (this.step) {
      case 'SAISIE_NUMBER':
        this.numberDestinatary = event.phoneNumber;
        if (this.operationType !== OPERATION_TYPE_TRANSFER_OM) {
          this.authServ.isPostpaid(this.numberDestinatary).subscribe(
            (isPostpaid: any) => {
              if (isPostpaid) {
                this.errorMsg = 'Ce numero ne peut pas recevoir de transfert.';
              } else {
                this.errorMsg = '';
                this.step = 'SAISIE_MONTANT';
              }
            },
            (err: any) => {
              this.loading = false;
              this.errorMsg = ' Une erreur est survenue, veuillez reessayer';
            }
          );
        } else {
          this.recipientHasOMAccount = event.hasOMAccount;
          this.step = 'SAISIE_MONTANT';
          this.omTransferPayload.msisdn2 = this.numberDestinatary;
        }
        break;
      case 'SAISIE_MONTANT':
        this.amount = event;
        this.step = 'DETAILS_TRANSF';
        break;
    }
  }

  contactGot(contact: Contact) {
    this.numberDestinatary = contact.phoneNumbers[0].value;
    this.firstName = contact.name.givenName;
    if (contact.name.familyName) {
      this.lastName = contact.name.familyName;
    }
    if (contact.name.middleName) {
      this.firstName += ` ${contact.name.middleName}`;
    }
    this.omTransferPayload.firstName = this.firstName;
    this.omTransferPayload.lastName = this.lastName;
    this.step = 'SAISIE_MONTANT';
  }

  pay(omTransferInfos: any) {
    if (this.transferType === OPERATION_TYPE_TRANSFER_OM) {
      this.transferOMWithCode = omTransferInfos.transferWithCode;
      if (this.transferOMWithCode) {
        this.transferOMType = OPERATION_TRANSFER_OM_WITH_CODE;
        this.omTransferPayload.firstName = omTransferInfos.firstName;
        this.omTransferPayload.lastName = omTransferInfos.lastName;
        this.omTransferPayload.amount = omTransferInfos.amountToTransfer;
      } else {
        this.transferOMType = OPERATION_TRANSFER_OM;
        this.omTransferPayload.amount =
          omTransferInfos.amountToTransfer + omTransferInfos.fees;
      }
      this.step = 'PIN_PAD_OM';
    } else if (this.transferType !== 'SEDDO BONUS') {
      this.step = 'TYPE_PIN_CODE';
    } else {
      this.bonusTransfert();
    }
  }

  bonusTransfert() {
    this.type = 'bonus';
    const transfertbonnusInfo: TransfertBonnus = {
      amount: Number(this.amount),
      dmsisdn: this.numberDestinatary,
      smsisdn: this.dashboardService.getCurrentPhoneNumber()
    };
    if (
      transfertbonnusInfo.amount + 20 >=
      this.soldebonustoutesdest + this.soldebonusverorange
    ) {
      this.failed = true;
      this.errorMsg =
        'Votre solde est insuffisant pour effectuer cette transaction';
      this.step = 'SUCCESS';
    } else {
      this.dashboardService.transferBonus(transfertbonnusInfo).subscribe(
        (res: any) => {
          if (res.code === '0') {
            this.step = 'SUCCESS';
            const followDetails = {
              amount: `${transfertbonnusInfo.amount} FCFA`,
              fees: `20 FCFA`
            };
          } else {
            this.failed = true;
            this.errorMsg = res.message;
            this.step = 'SUCCESS';
            const followDetails = { error_code: `${res.code}` };
          }
        },
        (error: any) => {
          this.failed = true;
          this.errorMsg = error.message;
          if (error.status === 503) {
            this.errorMsg = 'Ce service est momentanément indisponible';
          }
          this.step = 'SUCCESS';
        }
      );
    }
  }

  pingot(event: string) {
    this.pinHasError = false;
    if (Number(this.amount) + 20 + 489 > this.solderechargement) {
      this.pinHasError = true;
      this.pinErrMsg =
        'Votre solde est insuffisant pour effectuer cette transaction';
    } else {
      this.type = 'crédit';
      this.loading = true;
      const pin = event;
      const msisdn = this.dashboardService.getCurrentPhoneNumber();
      const msisdn2 = this.numberDestinatary.toString();
      const transferPayload = { msisdn, msisdn2, pin, amount: this.amount };
      this.dashboardService.transferCredit(transferPayload).subscribe(
        (res: any) => {
          this.loading = false;
          if (res.status === '200') {
            const followDetails = {
              amount: `${this.amount} FCFA`,
              fees: '20 FCFA'
            };
            this.step = 'SUCCESS';
          } else {
            const followDetails = { code_error: res.status };
            this.pinHasError = true;
            this.pinErrMsg = res.message;
          }
        },
        err => {
          this.loading = false;
          this.pinHasError = true;
          this.pinErrMsg =
            'Une erreur est survenue veuillez réessayer ultérieurement';
        }
      );
    }
  }

  goBack() {
    switch (this.step) {
      case 'CHOOSE_TRANSFER':
        this.router.navigate(['/dashboard']);
        break;
      case 'SAISIE_NUMBER':
        if (this.operationType === 'orange-money') {
          this.router.navigate(['/dashboard']);
        } else {
          this.step = 'CHOOSE_TRANSFER';
        }
        break;
      case 'SAISIE_MONTANT':
        this.step = 'SAISIE_NUMBER';
        break;
      case 'DETAILS_TRANSF':
        this.step = 'SAISIE_MONTANT';
        break;
      case 'TYPE_PIN_CODE':
        this.step = 'DETAILS_TRANSF';
        break;
      case 'PIN_PAD_OM':
        this.step = 'DETAILS_TRANSF';
        break;
    }
  }
  getSoldeCompteur() {
    if (this.transferType === OPERATION_TYPE_SEDDO_CREDIT) {
      this.compteur = 'crédit';
    } else if (this.transferType === OPERATION_TYPE_SEDDO_PASS) {
      this.compteur = 'pass internet';
    } else {
      this.compteur = 'bonus';
    }
  }
  getSoldeRechargementAndBonus() {
    this.dashboardService
      .getUserConsoInfosByCode([1, 2, 6])
      .subscribe((res: any) => {
        this.isLoaded = true;
        const myconso = getConsoByCategory(res)[USER_CONS_CATEGORY_CALL];
        if (myconso) {
          myconso.forEach(x => {
            if (x.code === 1) {
              this.solderechargement += Number(x.montant);
            } else if (x.code === 2) {
              this.soldebonusverorange += Number(x.montant);
            } else if (x.code === 6) {
              this.soldebonustoutesdest += Number(x.montant);
            }
          });
        }
      });
  }

  soldeGot(solde) {
    if (solde !== 'erreur') {
      this.failed = false;
      this.type = 'om';
      this.amount = this.omTransferPayload.amount;
      this.step = 'SUCCESS';
    }
  }

  goToPage(route: any) {
    if (route === '/transfer/orange-money') {
      this.step = 'SAISIE_MONTANT';
    } else {
      this.router.navigate([route]);
    }
  }
}
