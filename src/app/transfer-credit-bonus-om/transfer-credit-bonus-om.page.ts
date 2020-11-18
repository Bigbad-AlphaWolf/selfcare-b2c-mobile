import { Component, OnInit } from '@angular/core';
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
  OPERATION_TRANSFER_OM,
  SubscriptionModel,
} from 'src/shared';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { getConsoByCategory } from '../dashboard';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { TransfertBonnus } from '../services/dashboard-service';
import { Contact } from '@ionic-native/contacts';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { ModalController } from '@ionic/angular';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { OperationExtras } from '../models/operation-extras.model';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { ModalSuccessModel } from '../models/modal-success-infos.model';
import { OperationSuccessFailModalPage } from '../operation-success-fail-modal/operation-success-fail-modal.page';
import { take, tap } from 'rxjs/operators';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';

@Component({
  selector: 'app-transfer-credit-bonus-om',
  templateUrl: './transfer-credit-bonus-om.page.html',
  styleUrls: ['./transfer-credit-bonus-om.page.scss'],
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
  OPERATION_TYPE_TRANSFER_OM = OPERATION_TYPE_TRANSFER_OM;
  solderechargement = 0;
  soldebonusverorange = 0;
  soldebonustoutesdest = 0;
  failed;
  type;
  errorMsg;
  operationType;
  transferOMWithCode: boolean;
  fees: { feeValue: number; payFee: boolean };
  omTransferPayload = { amount: 0, msisdn2: '', prenom_receiver: null, nom_receiver: null };
  firstName = '';
  lastName = '';
  payFee = false;
  isLoaded = false;
  recipientHasOMAccount: boolean;
  transferOMPayload: { amount: number; msisdn2: string } = { amount: null, msisdn2: null };
  transferOMWithCodePayload: { amount: number; msisdn2: string; nom_receiver: string; prenom_receiver: string } = { amount: null,  msisdn2: null, nom_receiver: null, prenom_receiver: null };
  opXtras: OperationExtras = {};
  currentUser: string;
  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private authServ: AuthenticationService,
    private route: ActivatedRoute,
    private followAnalyticsService: FollowAnalyticsService,
    private modalController: ModalController,
    private orangeMoneyService: OrangeMoneyService  ) {}

  ngOnInit() {
    this.currentUser = this.dashboardService.getCurrentPhoneNumber();
  }

  ionViewWillEnter() {
    this.authServ.getSubscription(this.currentUser).pipe(tap((res: SubscriptionModel) => {
      this.opXtras.code = res.code;
    }),take(1)).subscribe();
    if (this.route.snapshot) {
      this.operationType = this.route.snapshot.paramMap.get('type');
    }
    if (this.operationType === OPERATION_TYPE_TRANSFER_OM) {
      this.step = 'SAISIE_NUMBER';
      this.transferType = OPERATION_TYPE_TRANSFER_OM;
      this.paymentMode = PAYMENT_MOD_OM;
      this.isLoaded = true;
    } else {
      this.step = 'CHOOSE_TRANSFER';
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
    this.errorMsg = null;
    switch (this.step) {
      case 'SAISIE_NUMBER':
        this.numberDestinatary = event.phoneNumber;
        if (this.operationType !== OPERATION_TYPE_TRANSFER_OM) {
          this.loading = true;
          this.authServ.isPostpaid(this.numberDestinatary).subscribe(
            (isPostpaid: any) => {
              this.loading = false;

              if (isPostpaid) {
                this.errorMsg = 'Ce numero ne peut pas recevoir de transfert.';
              } else {
                this.errorMsg = '';
                this.step = 'SAISIE_MONTANT';
              }
            },
            () => {
              this.loading = false;
              this.errorMsg = 'Une erreur est survenue, veuillez reessayer';
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
    // this.numberDestinatary = contact.phoneNumbers[0].value;
    this.firstName = contact.name.givenName;
    this.lastName = contact.name.familyName ? contact.name.familyName : '';
    this.firstName += contact.name.middleName
      ? ` ${contact.name.middleName}`
      : '';
    this.omTransferPayload.prenom_receiver = this.firstName;
    this.omTransferPayload.nom_receiver = this.lastName;
    this.step = 'SAISIE_MONTANT';
  }

  pay(omTransferInfos: any) {
    console.log('omTransfertPayload',omTransferInfos);
    
    if (this.transferType === OPERATION_TYPE_TRANSFER_OM) {
      this.transferOMWithCode = omTransferInfos.transferWithCode;
      if (this.transferOMWithCode) {
        this.transferOMType = OPERATION_TRANSFER_OM_WITH_CODE;
        this.transferOMWithCodePayload.prenom_receiver = omTransferInfos.firstName;
        this.transferOMWithCodePayload.nom_receiver = omTransferInfos.lastName;
        this.transferOMWithCodePayload.amount = omTransferInfos.amountToTransfer;
        this.transferOMWithCodePayload.msisdn2 = this.omTransferPayload.msisdn2;
      } else {
        this.transferOMType = OPERATION_TRANSFER_OM;
        this.transferOMPayload.amount = omTransferInfos.amountToTransfer + omTransferInfos.fees;
        this.transferOMPayload.msisdn2 = this.omTransferPayload.msisdn2
      }
      this.openPinpad(this.transferOMType);
    } else if (this.transferType !== 'SEDDO BONUS') {
      this.step = 'TYPE_PIN_CODE';
    } else {
      this.bonusTransfert();
    }
  }

  async openPinpad(purchaseType?: string) {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: purchaseType,
        transferMoneyPayload: this.transferOMPayload,
        transferMoneyWithCodePayload: this.transferOMWithCodePayload,
        opXtras: {...this.opXtras, }
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response.data && response.data.success) {
        this.openSuccessFailModal({
          opXtras: response.data.opXtras,
          success: true,
          msisdnBuyer: this.orangeMoneyService.getOrangeMoneyNumber(),
          buyForMe:
            this.omTransferPayload.msisdn2 ===
            this.orangeMoneyService.getOrangeMoneyNumber(),
        });
      }
    });
    return await modal.present();
  }

  async openSuccessFailModal(params: ModalSuccessModel) {
    params.paymentMod = this.paymentMode;
    params.recipientMsisdn = this.omTransferPayload.msisdn2;
    params.recipientName = this.omTransferPayload.nom_receiver ? this.omTransferPayload.nom_receiver : null;
    params.purchaseType = this.transferOMType;
    params.amount = this.transferOMType === OPERATION_TRANSFER_OM ? this.transferOMPayload.amount : this.transferOMWithCodePayload.amount ;
    const modal = await this.modalController.create({
      component: OperationSuccessFailModalPage,
      cssClass: params.success ? 'success-modal' : 'failed-modal',
      componentProps: params,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }

  bonusTransfert() {
    this.type = 'bonus';
    const transfertbonnusInfo: TransfertBonnus = {
      amount: Number(this.amount),
      dmsisdn: this.numberDestinatary,
      smsisdn: this.dashboardService.getCurrentPhoneNumber(),
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
      this.loading = true;
      this.dashboardService.transferBonus(transfertbonnusInfo).subscribe(
        (res: any) => {
          this.loading = false;
          if (res.code === '0') {
            this.step = 'SUCCESS';
            const followDetails = {
              amount: `${transfertbonnusInfo.amount} FCFA`,
              fees: `20 FCFA`,
            };
            this.followAnalyticsService.registerEventFollow(
              'Transfer_Bonus_Success',
              'event',
              followDetails
            );
          } else {
            this.failed = true;
            this.errorMsg = res.message;
            this.step = 'SUCCESS';
            const followDetails = { error_code: `${res.code}` };
            this.followAnalyticsService.registerEventFollow(
              'Transfer_Bonus_Error',
              'error',
              followDetails
            );
          }
        },
        (error: any) => {
          this.loading = false;
          this.failed = true;
          this.errorMsg = error.message;
          if (error.status === 503) {
            this.errorMsg = 'Ce service est momentanément indisponible';
          }
          this.followAnalyticsService.registerEventFollow(
            'Transfer_Bonus_Error',
            'error',
            'Service indisponible'
          );
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
              fees: '20 FCFA',
              msisdn,
              msisdn2,
            };
            this.followAnalyticsService.registerEventFollow(
              'Transfer_Credit_Success',
              'event',
              followDetails
            );
            this.step = 'SUCCESS';
          } else {
            this.pinErrMsg = res.message;
            const followDetails = {
              code_error: res.status,
              msisdn,
              msisdn2,
              message: this.pinErrMsg,
            };
            this.followAnalyticsService.registerEventFollow(
              'Transfer_Credit_Error',
              'error',
              followDetails
            );
            this.pinHasError = true;
          }
        },
        () => {
          this.followAnalyticsService.registerEventFollow(
            'Transfer_Credit_Error',
            'error',
            'Service indisponible'
          );
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
      .getUserConsoInfosByCode(null, [1, 2, 6])
      .subscribe((res: any) => {
        this.isLoaded = true;
        const myconso = getConsoByCategory(res)[USER_CONS_CATEGORY_CALL];
        if (myconso) {
          myconso.forEach((x) => {
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

  initialStep() {
    if (this.operationType === OPERATION_TYPE_TRANSFER_OM) {
      this.step = 'SAISIE_NUMBER';
    } else {
      this.step = 'CHOOSE_TRANSFER';
    }
  }
}
