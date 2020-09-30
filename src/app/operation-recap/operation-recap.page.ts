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
} from 'src/shared';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { OperationSuccessFailModalPage } from '../operation-success-fail-modal/operation-success-fail-modal.page';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { OperationExtras } from '../models/operation-extras.model';
import { OPERATION_WOYOFAL } from '../utils/operations.util';
import { OfferPlan } from 'src/shared/models/offer-plan.model';
import { PROFILE_TYPE_POSTPAID } from '../dashboard';

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
  state: any;
  subscriptionInfos: SubscriptionModel;
  buyCreditPayload: any;
  offerPlan: OfferPlan;
  constructor(
    public modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private followAnalyticsService: FollowAnalyticsService,
    private appRouting: ApplicationRoutingService,
    private orangeMoneyService: OrangeMoneyService,
    private navController: NavController,
    private authServ: AuthenticationService
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
          this.state = state;
          this.purchaseType = state.purchaseType;
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
              this.paymentMod = 'ORANGE_MONEY';
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
              this.paymentMod = 'ORANGE_MONEY';
              break;
            case OPERATION_TYPE_MERCHANT_PAYMENT:
              this.amount = state.amount;
              this.merchantCode = state.merchant.merchantCode;
              this.merchantName = state.merchant.name;
              this.paymentMod = 'ORANGE_MONEY';
              this.merchantPaymentPayload = {
                amount: this.amount,
                code_marchand: this.merchantCode,
                nom_marchand: this.merchantName,
              };
              break;
            case OPERATION_TYPE_RECHARGE_CREDIT:
              this.opXtras = state;
              this.amount = this.opXtras.amount;
              this.paymentMod = 'ORANGE_MONEY';
              this.recipientMsisdn = this.opXtras.recipientMsisdn;
              this.recipientName = this.opXtras.recipientFromContact
                ? this.opXtras.recipientFirstname +
                  ' ' +
                  this.opXtras.recipientLastname
                : '';
              this.offerPlan = state.offerPlan;
              break;
            case OPERATION_WOYOFAL:
              this.opXtras = state;
              // this.amount = this.opXtras.amount;

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
        if (this.subscriptionInfos.profil === PROFILE_TYPE_POSTPAID) {
          this.openPinpad();
        } else {
          this.setPaymentMod();
        }
        break;
      case OPERATION_TYPE_RECHARGE_CREDIT:
        this.openPinpad();
        break;
      case OPERATION_TYPE_MERCHANT_PAYMENT:
      case OPERATION_TRANSFER_OM:
      case OPERATION_TRANSFER_OM_WITH_CODE:
        this.openPinpad();
        break;
      case OPERATION_WOYOFAL:
        this.openPinpad();
        break;
    }
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
      if (response.data && response.data.paymentMod === 'CREDIT') {
        this.paymentMod = 'CREDIT';
        this.payWithCredit();
        this.followAnalyticsService.registerEventFollow(
          'Buy_pass_payment_mod',
          'event',
          'CREDIT'
        );
      }
      if (response.data && response.data.paymentMod === 'ORANGE_MONEY') {
        this.paymentMod = 'ORANGE_MONEY';
        this.openPinpad();
        this.followAnalyticsService.registerEventFollow(
          'Buy_pass_payment_mod',
          'event',
          'ORANGE_MONEY'
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
          msisdn2: this.state.recipientMsisdn,
          amount: this.state.amount,
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
    // if(this.purchaseType === OPERATION_TYPE_RECHARGE_CREDIT)
    // console.log(this.purchaseType);

    //   this.navController.navigateBack(CreditPassAmountPage.PATH);
    this.navController.pop();
  }

  payWithCredit() {
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
    this.dashboardService.buyPassByCredit(payload).subscribe(
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
    this.openSuccessFailModal({ success: false });
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
    return ['RECHARGEMENT_CREDIT', 'OPERATION_WOYOFAL', 'OPERATION_TYPE_PASS_VOYAGE'].includes(   
      this.purchaseType
    );
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
}
