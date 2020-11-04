import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SetPaymentChannelModalPage } from '../set-payment-channel-modal/set-payment-channel-modal.page';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyPassModel } from '../services/dashboard-service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import {
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_MERCHANT_PAYMENT,
  OPERATION_TRANSFER_OM_WITH_CODE,
  OPERATION_TRANSFER_OM,
  SubscriptionModel,
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TYPE_BONS_PLANS,
  OPERATION_TYPE_PASS_ALLO,
  OPERATION_TYPE_PASS_VOYAGE,
  OPERATION_ENABLE_DALAL,
  MONTHLY_DALAL_TARIF,
  PAYMENT_MOD_CREDIT,
  PAYMENT_MOD_OM,
} from 'src/shared';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { OperationSuccessFailModalPage } from '../operation-success-fail-modal/operation-success-fail-modal.page';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { OperationExtras } from '../models/operation-extras.model';
import {
  OPERATION_RAPIDO,
  OPERATION_WOYOFAL,
} from '../utils/operations.constants';
import { OfferPlan } from 'src/shared/models/offer-plan.model';
import { PROFILE_TYPE_POSTPAID } from '../dashboard';
import { DalalTonesService } from '../services/dalal-tones-service/dalal-tones.service';

@Component({
  selector: 'app-operation-recap',
  templateUrl: './operation-recap.page.html',
  styleUrls: ['./operation-recap.page.scss'],
})
export class OperationRecapPage implements OnInit {
  static ROUTE_PATH = '/operation-recap';
  opXtras: OperationExtras = {};
  passChoosen: any;
  recipientMsisdn: string;
  recipientName: string;
  recipientFirstName: string; // required for OM transfer with code
  recipientLastName: string; // required for OM transfer with code
  recipientCodeFormule;
  buyingPass: boolean;
  currentUserNumber: string;
  buyPassFailed: boolean;
  buyPassErrorMsg: string;
  buyPassPayload: any;
  paymentMod: string;
  purchaseType: string;
  merchantCode: number;
  merchantName: string;
  amount;
  merchantPaymentPayload: {
    amount: number;
    code_marchand: number;
    nom_marchand: string;
  };
  transferOMPayload: { amount: number; msisdn2: string } = {
    amount: null,
    msisdn2: null,
  };
  transferOMWithCodePayload: {
    amount: number;
    msisdn2: string;
    nom_receiver: string;
    prenom_receiver: string;
  } = {
    amount: null,
    msisdn2: null,
    nom_receiver: null,
    prenom_receiver: null,
  };
  OPERATION_INTERNET_TYPE = OPERATION_TYPE_PASS_INTERNET;
  OPERATION_ILLIMIX_TYPE = OPERATION_TYPE_PASS_ILLIMIX;
  OPERATION_ALLO_TYPE = OPERATION_TYPE_PASS_ALLO;
  OPERATION_TYPE_MERCHANT_PAYMENT = OPERATION_TYPE_MERCHANT_PAYMENT;
  OPERATION_TRANSFER_OM_WITH_CODE = OPERATION_TRANSFER_OM_WITH_CODE;
  OPERATION_TRANSFER_OM = OPERATION_TRANSFER_OM;
  OPERATION_TYPE_BONS_PLANS = OPERATION_TYPE_BONS_PLANS;
  OPERATION_ENABLE_DALAL = OPERATION_ENABLE_DALAL;
  DALAL_TARIF = MONTHLY_DALAL_TARIF;
  subscriptionInfos: SubscriptionModel;
  buyCreditPayload: any;
  offerPlan: OfferPlan;
  isLightMod: boolean;
  constructor(
    public modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private followAnalyticsService: FollowAnalyticsService,
    private appRouting: ApplicationRoutingService,
    private orangeMoneyService: OrangeMoneyService,
    private navController: NavController,
    private authServ: AuthenticationService,
    private dalalTonesService: DalalTonesService
  ) {}

  ngOnInit() {
    this.currentUserNumber = this.dashboardService.getCurrentPhoneNumber();
    if (this.route)
      this.route.queryParams.subscribe(() => {
        if (
          this.router.getCurrentNavigation() &&
          this.router.getCurrentNavigation().extras.state &&
          this.router.getCurrentNavigation().extras.state.purchaseType
        ) {
          const state = this.router.getCurrentNavigation().extras.state;
          this.opXtras = state;
          this.purchaseType = state.purchaseType;
          this.isLightMod = state.isLightMod;
          switch (this.purchaseType) {
            case OPERATION_TYPE_PASS_INTERNET:
            case OPERATION_TYPE_PASS_ILLIMIX:
            case OPERATION_TYPE_PASS_ALLO:
              this.recipientName = state.recipientName;
              this.passChoosen = state.pass;
              this.recipientMsisdn = state.recipientMsisdn;
              this.recipientCodeFormule = state.recipientCodeFormule;
              this.buyPassPayload = {
                destinataire: this.recipientMsisdn,
                pass: this.passChoosen,
              };
              this.offerPlan = state.offerPlan;
              break;
            case OPERATION_TYPE_PASS_VOYAGE:
              this.opXtras = state;
              this.recipientMsisdn = this.opXtras.recipientMsisdn;
              this.recipientName = this.opXtras.recipientFromContact
                ? this.opXtras.recipientFirstname +
                  ' ' +
                  this.opXtras.recipientLastname
                : '';
              this.buyPassPayload = {
                destinataire: this.recipientMsisdn,
                pass: this.opXtras.pass,
              };
              this.passChoosen = this.opXtras.pass;
              this.offerPlan = state.offerPlan;
              break;
            case OPERATION_TRANSFER_OM_WITH_CODE:
              this.recipientMsisdn = state.recipientMsisdn;
              this.amount = state.amount + state.fee;
              this.transferOMWithCodePayload.amount = state.amount;
              this.transferOMWithCodePayload.msisdn2 = this.recipientMsisdn;
              this.transferOMWithCodePayload.prenom_receiver =
                state.recipientFirstname;
              this.transferOMWithCodePayload.nom_receiver =
                state.recipientLastname;
              this.recipientFirstName = state.recipientFirstname;
              this.recipientLastName = state.recipientLastname;
              this.recipientName =
                this.recipientFirstName + ' ' + this.recipientLastName;
              this.paymentMod = PAYMENT_MOD_OM;
              break;
            case OPERATION_TRANSFER_OM:
              this.recipientMsisdn = state.recipientMsisdn;
              this.amount = state.includeFee
                ? state.amount + state.fee
                : state.amount;
              this.transferOMPayload.amount = this.amount;
              this.transferOMPayload.msisdn2 = this.recipientMsisdn;
              this.recipientName =
                state.recipientFirstname + ' ' + state.recipientLastname;
              this.paymentMod = PAYMENT_MOD_OM;
              break;
            case OPERATION_TYPE_MERCHANT_PAYMENT:
              this.amount = state.amount;
              this.merchantCode = state.merchant.merchantCode;
              this.merchantName = state.merchant.name;
              this.paymentMod = PAYMENT_MOD_OM;
              this.merchantPaymentPayload = {
                amount: this.amount,
                code_marchand: this.merchantCode,
                nom_marchand: this.merchantName,
              };
              break;
            case OPERATION_TYPE_RECHARGE_CREDIT:
              this.opXtras = state;
              this.amount = this.opXtras.amount;
              this.paymentMod = PAYMENT_MOD_OM;
              this.recipientMsisdn = this.opXtras.recipientMsisdn;
              this.recipientName = this.opXtras.recipientFromContact
                ? this.opXtras.recipientFirstname +
                  ' ' +
                  this.opXtras.recipientLastname
                : '';
              this.offerPlan = state.offerPlan;
              break;
            case OPERATION_RAPIDO:
            case OPERATION_WOYOFAL:
              this.opXtras = state;
              break;

            default:
              break;
          }
        } else {
          this.appRouting.goToDashboard();
        }
      });

    this.authServ
      .getSubscription(this.currentUserNumber)
      .subscribe((res: SubscriptionModel) => {
        this.subscriptionInfos = res;
      });
  }

  pay() {
    switch (this.purchaseType) {
      case OPERATION_TYPE_PASS_INTERNET:
      case OPERATION_TYPE_PASS_VOYAGE:
      case OPERATION_TYPE_PASS_ILLIMIX:
      case OPERATION_TYPE_PASS_ALLO:
        if (this.isLightMod) {
          const hmac = this.authServ.getHmac();
          this.payWithCredit(hmac);
        } else if (this.subscriptionInfos.profil === PROFILE_TYPE_POSTPAID) {
          this.openPinpad();
        } else {
          this.setPaymentMod();
        }
        break;
      case OPERATION_TYPE_RECHARGE_CREDIT:
      case OPERATION_TYPE_MERCHANT_PAYMENT:
      case OPERATION_TRANSFER_OM:
      case OPERATION_TRANSFER_OM_WITH_CODE:
      case OPERATION_RAPIDO:
      case OPERATION_WOYOFAL:
        this.openPinpad();
        break;
      case OPERATION_ENABLE_DALAL:
        this.activateDalal();
        break;
      default:
        break;
    }
  }

  activateDalal() {
    this.buyingPass = true;
    this.dalalTonesService.activateDalal(this.opXtras.dalal).subscribe(
      (res) => {
        this.buyingPass = false;
        this.openSuccessFailModal({
          success: true,
          msisdnBuyer: this.dashboardService.getCurrentPhoneNumber(),
          buyForMe: true,
        });
      },
      (err) => {
        this.buyingPass = false;
        const activationErrorMsg =
          err && err.error && err.error.message
            ? err.error.message
            : 'Une erreur est survenue';
        this.openSuccessFailModal({
          success: false,
          msisdnBuyer: this.dashboardService.getCurrentPhoneNumber(),
          buyForMe: true,
          errorMsg: activationErrorMsg,
        });
      }
    );
  }

  async setPaymentMod() {
    const modal = await this.modalController.create({
      component: SetPaymentChannelModalPage,
      cssClass: 'set-channel-payment-modal',
      componentProps: {
        pass: this.passChoosen,
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response.data && response.data.paymentMod === PAYMENT_MOD_CREDIT) {
        this.paymentMod = PAYMENT_MOD_CREDIT;
        this.payWithCredit();
        this.followAnalyticsService.registerEventFollow(
          'Buy_pass_payment_mod',
          'event',
          PAYMENT_MOD_CREDIT
        );
      }
      if (response.data && response.data.paymentMod === PAYMENT_MOD_OM) {
        this.paymentMod = PAYMENT_MOD_OM;
        this.openPinpad();
        this.followAnalyticsService.registerEventFollow(
          'Buy_pass_payment_mod',
          'event',
          PAYMENT_MOD_OM
        );
      }
    });
    return await modal.present();
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: this.purchaseType,
        buyPassPayload: this.buyPassPayload,
        buyCreditPayload: {
          msisdn2: this.opXtras.recipientMsisdn,
          amount: this.opXtras.amount,
        },
        opXtras: this.opXtras,
        merchantPaymentPayload: this.merchantPaymentPayload,
        transferMoneyPayload: this.transferOMPayload,
        transferMoneyWithCodePayload: this.transferOMWithCodePayload,
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response.data && response.data.success) {
        this.openSuccessFailModal({
          opXtras: response.data.opXtras,
          success: true,
          msisdnBuyer: this.orangeMoneyService.getOrangeMoneyNumber(),
          buyForMe:
            this.recipientMsisdn ===
            this.orangeMoneyService.getOrangeMoneyNumber(),
        });
      }
    });
    return await modal.present();
  }

  async openSuccessFailModal(params: ModalSuccessModel) {
    params.passBought = this.passChoosen;
    params.paymentMod = this.paymentMod;
    params.recipientMsisdn = this.recipientMsisdn;
    params.recipientName = this.recipientName;
    params.purchaseType = this.purchaseType;
    params.amount = this.amount;
    params.merchantCode = this.merchantCode;
    params.merchantName = this.merchantName;
    params.dalal = this.opXtras ? this.opXtras.dalal : null;
    const modal = await this.modalController.create({
      component: OperationSuccessFailModalPage,
      cssClass: params.success ? 'success-modal' : 'failed-modal',
      componentProps: params,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }

  goBack() {
    this.navController.pop();
  }

  payWithCredit(hmac?: string) {
    this.buyingPass = true;
    const codeIN = this.passChoosen.passPromo
      ? this.passChoosen.passPromo.price_plan_index
      : this.passChoosen.price_plan_index;
    const amount = this.passChoosen.passPromo
      ? +this.passChoosen.passPromo.tarif
      : +this.passChoosen.tarif;
    const msisdn = this.currentUserNumber;
    const receiver = this.recipientMsisdn;
    const type =
      this.purchaseType === OPERATION_TYPE_PASS_INTERNET
        ? 'internet'
        : 'illimix';
    const payload: BuyPassModel = {
      type,
      codeIN,
      amount,
      msisdn,
      receiver,
    };
    this.dashboardService.buyPassByCredit(payload, hmac).subscribe(
      (res: any) => {
        this.transactionSuccessful(res);
      },
      () => {
        this.transactionFailure();
      }
    );
  }

  payWithOm() {
    this.openPinpad();
  }

  transactionSuccessful(res: any) {
    this.buyingPass = false;
    if (res.code !== '0') {
      this.buyPassFailed = true;
      this.buyPassErrorMsg = res.message;
      const followDetails = { error_code: res.code };
      this.followAnalyticsService.registerEventFollow(
        'Credit_Buy_Pass_Internet_Error',
        'error',
        followDetails
      );
    } else {
      this.buyPassFailed = false;
      const followDetails = {
        option_name: this.passChoosen.nom,
        amount: this.passChoosen.tarif,
        plan: this.passChoosen.price_plan_index,
      };
      this.followAnalyticsService.registerEventFollow(
        'Credit_Buy_Pass_Internet_Success',
        'event',
        followDetails
      );
    }
    this.openSuccessFailModal({
      success: !this.buyPassFailed,
      msisdnBuyer: this.dashboardService.getCurrentPhoneNumber(),
      buyForMe:
        this.recipientMsisdn === this.dashboardService.getCurrentPhoneNumber(),
      errorMsg: this.buyPassErrorMsg,
    });
  }

  transactionFailure() {
    this.buyingPass = false;
    // this.openSuccessFailModal({ success: false });
    this.buyPassErrorMsg =
      'Service indisponible. Veuillez réessayer ultérieurement';
    this.followAnalyticsService.registerEventFollow(
      'Credit_Buy_Pass_Internet_Error',
      'error',
      {
        msisdn1: this.currentUserNumber,
        msisdn2: this.recipientMsisdn,
        message: 'Service indisponible',
      }
    );
    this.openSuccessFailModal({
      success: false,
      msisdnBuyer: this.dashboardService.getCurrentPhoneNumber(),
      buyForMe:
        this.recipientMsisdn === this.dashboardService.getCurrentPhoneNumber(),
      errorMsg: this.buyPassErrorMsg,
    });
  }

  get operationTypeRecap() {
    return [
      'RECHARGEMENT_CREDIT',
      'OPERATION_TYPE_PASS_VOYAGE',
      'OPERATION_WOYOFAL',
      'OPERATION_RAPIDO',
    ].includes(this.purchaseType);
  }
}

interface ModalSuccessModel {
  purchaseType?: string;
  passBought?: any;
  success?: boolean;
  recipientMsisdn?: string;
  recipientName?: string;
  buyForMe?: boolean;
  paymentMod?: string;
  msisdnBuyer?: string;
  errorMsg?: string;
  amount?: number;
  merchantName?: string;
  merchantCode?: number;
  opXtras?: OperationExtras;
  dalal?: any;
}
