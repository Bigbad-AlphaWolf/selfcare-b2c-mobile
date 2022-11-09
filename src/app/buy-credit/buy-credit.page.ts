import { Component, OnInit } from '@angular/core';
import { OPERATION_TYPE_RECHARGE_CREDIT, PAYMENT_MOD_OM, formatCurrency, SubscriptionModel } from 'src/shared';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { PROFILE_TYPE_POSTPAID } from '../dashboard';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { ModalController, NavController } from '@ionic/angular';
import { OperationSuccessFailModalPage } from '../operation-success-fail-modal/operation-success-fail-modal.page';
import { ModalSuccessModel } from '../models/modal-success-infos.model';
import { OperationExtras } from '../models/operation-extras.model';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { OemLoggingService } from '../services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from '../utils/utils';

@Component({
  selector: 'app-buy-credit',
  templateUrl: './buy-credit.page.html',
  styleUrls: ['./buy-credit.page.scss'],
})
export class BuyCreditPage implements OnInit {
  OPERATION_TYPE_RECHARGE_CREDIT = OPERATION_TYPE_RECHARGE_CREDIT;
  operation;
  typeOMCode;
  step = 0;
  isForMyOwnNumber = true;
  destinatorPhoneNumber = '';
  choosedPaymentMod = PAYMENT_MOD_OM;
  amount;
  creditToBuy;
  pinErrorMsg = '';
  pinPadHasError = false;
  PROFILE_TYPE_POSTPAID = PROFILE_TYPE_POSTPAID;
  balancePinErrorMsg;
  balancePinPadHasError;
  currentOMBalance = 0;
  purchasePass: any;
  errorCounting = 0;
  failed: boolean;
  hideUserSolde = true;
  omBalance;
  recipient;
  title = 'Recharger du crédit';
  currentProfil;
  currentNumber;
  recipientFirstName = '';
  recipientLastName = '';
  isProcessing: boolean;
  opXtras: OperationExtras = {};
  constructor(
    private dashbordServ: DashboardService,
    private authService: AuthenticationService,
    private oemLoggingService: OemLoggingService,
    private omService: OrangeMoneyService,
    private modalController: ModalController,
    private navControl: NavController,
    private appRout: ApplicationRoutingService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.currentNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.step = 0;
    this.authService.getSubscription(this.currentNumber).subscribe((souscription: SubscriptionModel) => {
      this.currentProfil = souscription.profil;
      this.opXtras.code = souscription.code;
    });
    this.checkOmAccountSession();
  }
  checkOmAccountSession() {
    this.isProcessing = true;
    this.omService.omAccountSession().subscribe((omSession: any) => {
      this.isProcessing = false;

      if (omSession.msisdn === 'error' || !omSession.hasApiKey) {
        this.openPinpad();
      }
    });
  }

  async openPinpad(purchaseType?: string) {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: purchaseType,
        buyCreditPayload: {
          msisdn2: this.destinatorPhoneNumber,
          amount: this.amount,
        },
        opXtras: this.opXtras,
      },
    });
    modal.onDidDismiss().then(response => {
      if (purchaseType) {
        if (response && response.data) {
          this.openSuccessFailModal({
            opXtras: response.data.opXtras,
            success: true,
            msisdnBuyer: this.omService.getOrangeMoneyNumber(),
            buyForMe: this.destinatorPhoneNumber === this.omService.getOrangeMoneyNumber(),
          });
        }
      } else {
        if (response && response.data) {
          this.hideUserSolde = false;
          this.omBalance = response.data.balance;
        } else {
          this.appRout.goToDashboard();
        }
      }
    });
    return await modal.present();
  }

  showOMBalancePinPad() {
    if (this.step === 1) {
      this.operation = 'CHECK_SOLDE';
    }
  }

  soldeGot(solde) {
    if (solde !== 'erreur') {
      this.omBalance = solde;
      this.hideUserSolde = false;
      if (this.step === 2) {
        this.step = 3;
      }
    } else {
      if (this.step === 2) {
        if (this.errorCounting < 3) {
          this.errorCounting += 1;
        } else if (this.errorCounting === 3) {
          this.failed = true;
          this.step = 3;
        }
      }
    }
  }

  formatCurrency(data) {
    return formatCurrency(data);
  }

  nextStepOfSelectDest(destinfos: { destinataire: string; code: string }) {
    this.isForMyOwnNumber = this.dashbordServ.getCurrentPhoneNumber() === destinfos.destinataire;
    this.destinatorPhoneNumber = destinfos.destinataire;
    this.isForMyOwnNumber
      ? this.oemLoggingService.registerEvent('Recharge_OM_ChoixDestinataire', convertObjectToLoggingPayload({ destinataire: destinfos.destinataire }))
      : this.oemLoggingService.registerEvent('Recharge_OM_Destinataire_Moi', convertObjectToLoggingPayload({ destinataire: destinfos.destinataire }));
    this.goToNextStep();
  }

  setAmount(amount: number) {
    this.amount = amount;
    this.goToNextStep();
  }

  payCredit() {
    this.operation = 'BUY_CREDIT';
    this.creditToBuy = {
      msisdn2: this.destinatorPhoneNumber,
      amount: this.amount,
    };
    this.openPinpad(OPERATION_TYPE_RECHARGE_CREDIT);
  }

  goToNextStep() {
    this.step++;
  }

  goToPreviousStep() {
    this.operation = 'CHECK_SOLDE';
    const previousStep = this.step - 1;
    if (previousStep < 0) {
      this.goToDashboardPage();
    } else {
      this.step = previousStep;
    }
  }

  initialStep() {
    this.choosedPaymentMod = PAYMENT_MOD_OM;
    this.amount = 0;
    this.isForMyOwnNumber = false;
    this.creditToBuy = null;
    this.pinErrorMsg = '';
    this.pinPadHasError = false;
    this.balancePinErrorMsg = '';
    this.balancePinPadHasError = false;
    this.currentOMBalance = 0;
    this.hideUserSolde = true;
    this.step = 0;
  }

  goToDashboardPage() {
    this.navControl.pop();
  }

  contactGot(contact) {
    this.recipientFirstName = contact.name.givenName ? contact.name.givenName : '';
    this.recipientLastName = contact.name.familyName ? contact.name.familyName : '';
    this.recipientFirstName += contact.name.middleName ? ` ${contact.name.middleName}` : '';
  }

  async openSuccessFailModal(params: ModalSuccessModel) {
    params.paymentMod = this.choosedPaymentMod;
    params.recipientMsisdn = this.destinatorPhoneNumber;
    params.recipientName = this.recipientFirstName && this.recipientLastName ? this.recipientFirstName + ' ' + this.recipientLastName : null;
    params.purchaseType = OPERATION_TYPE_RECHARGE_CREDIT;
    params.amount = this.amount;
    const modal = await this.modalController.create({
      component: OperationSuccessFailModalPage,
      cssClass: params.success ? 'success-modal' : 'failed-modal',
      componentProps: params,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }
}
