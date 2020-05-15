import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SetPaymentChannelModalPage } from '../set-payment-channel-modal/set-payment-channel-modal.page';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { BuyPassModel } from '../services/dashboard-service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import {
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_MERCHANT_PAYMENT,
} from 'src/shared';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { OperationSuccessFailModalPage } from '../operation-success-fail-modal/operation-success-fail-modal.page';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';

@Component({
  selector: 'app-operation-recap',
  templateUrl: './operation-recap.page.html',
  styleUrls: ['./operation-recap.page.scss'],
})
export class OperationRecapPage implements OnInit {
  passChoosen: any;
  recipientMsisdn: string;
  recipientName: string;
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
  merchantPaymentPayload: any;
  OPERATION_INTERNET_TYPE = OPERATION_TYPE_PASS_INTERNET;
  OPERATION_ILLIMIX_TYPE = OPERATION_TYPE_PASS_ILLIMIX;
  OPERATION_TYPE_MERCHANT_PAYMENT = OPERATION_TYPE_MERCHANT_PAYMENT;
  constructor(
    public modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private followAnalyticsService: FollowAnalyticsService,
    private appRouting: ApplicationRoutingService,
    private orangeMoneyService: OrangeMoneyService
  ) {}

  ngOnInit() {
    this.currentUserNumber = this.dashboardService.getCurrentPhoneNumber();
    this.route.queryParams.subscribe((params) => {
      if (
        this.router.getCurrentNavigation() &&
        this.router.getCurrentNavigation().extras.state &&
        this.router.getCurrentNavigation().extras.state.purchaseType
      ) {
        this.recipientName = this.router.getCurrentNavigation().extras.state.recipientName;
        this.purchaseType = this.router.getCurrentNavigation().extras.state.purchaseType;
        switch (this.purchaseType) {
          case OPERATION_TYPE_PASS_INTERNET:
          case OPERATION_TYPE_PASS_ILLIMIX:
            this.passChoosen = this.router.getCurrentNavigation().extras.state.pass;
            this.recipientMsisdn = this.router.getCurrentNavigation().extras.state.recipientMsisdn;
            this.recipientCodeFormule = this.router.getCurrentNavigation().extras.state.recipientCodeFormule;
            this.buyPassPayload = {
              destinataire: this.recipientMsisdn,
              pass: this.passChoosen,
            };
            break;
          case OPERATION_TYPE_MERCHANT_PAYMENT:
            this.amount = this.router.getCurrentNavigation().extras.state.amount;
            this.merchantCode = this.router.getCurrentNavigation().extras.state.merchantCode;
            this.merchantName = this.router.getCurrentNavigation().extras.state.merchantName;
            break;
          default:
            break;
        }
      } else {
        this.appRouting.goToDashboard();
      }
    });
  }

  pay() {
    switch (this.purchaseType) {
      case OPERATION_TYPE_PASS_INTERNET:
      case OPERATION_TYPE_PASS_ILLIMIX:
        this.presentModal();
        break;
      case OPERATION_TYPE_MERCHANT_PAYMENT:
        this.openPinpad();
        break;
    }
  }

  async presentModal() {
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
        merchantPaymentPayload: this.merchantPaymentPayload,
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response.data && response.data.success) {
        this.openSuccessFailModal({
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
    const modal = await this.modalController.create({
      component: OperationSuccessFailModalPage,
      cssClass: params.success ? 'success-modal' : 'failed-modal',
      componentProps: params,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((response) => {});
    return await modal.present();
  }

  goBack() {
    let navigationExtras: NavigationExtras = {
      state: {
        payload: {
          destinataire: this.recipientMsisdn,
          code: this.recipientCodeFormule,
          purchaseType: this.purchaseType,
          recipientName: this.recipientName,
        },
      },
    };
    this.router.navigate(['/list-pass'], navigationExtras);
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
      (err) => {
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
}
