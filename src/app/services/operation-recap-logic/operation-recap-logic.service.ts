import { Injectable } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { FollowOemlogPurchaseInfos } from 'src/app/models/follow-log-oem-purchase-Infos.model';
import { ModalSuccessModel } from 'src/app/models/modal-success-infos.model';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { OperationSuccessFailModalPage } from 'src/app/operation-success-fail-modal/operation-success-fail-modal.page';
import { SetPaymentChannelModalPage } from 'src/app/set-payment-channel-modal/set-payment-channel-modal.page';
import { OPERATION_TYPE_PASS_USAGE } from 'src/app/utils/operations.constants';
import {
  OPERATION_ENABLE_DALAL,
  OPERATION_TYPE_BONS_PLANS,
  OPERATION_TYPE_PASS_ILLIFLEX,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_VOYAGE,
  PAYMENT_MOD_CREDIT,
  PAYMENT_MOD_OM,
} from 'src/shared';
import { FaceIdRequestModalComponent } from 'src/shared/face-id-request-modal/face-id-request-modal.component';
import { BuyPassModel } from '../dashboard-service';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { FollowAnalyticsService } from '../follow-analytics/follow-analytics.service';
import { FACE_ID_PERMISSIONS, OrangeMoneyService } from '../orange-money-service/orange-money.service';

@Injectable({
  providedIn: 'root',
})
export class OperationRecapLogicService {
  paymentMod: string;
  opXtras: OperationExtras;
  recipientName: string;
  amount: number;
  merchantCode: number;
  merchantName: string;
  buyingPass: boolean;
  currentUserNumber = this.dashboardService.getCurrentPhoneNumber();
  buyPassFailed: boolean;
  buyPassErrorMsg: string;
  loader;
  constructor(
    private modalController: ModalController,
    private followAnalyticsService: FollowAnalyticsService,
    private orangeMoneyService: OrangeMoneyService,
    private dashboardService: DashboardService,
    private loaderCtl: LoadingController
  ) {}

  initRecapInfos(opXtras: OperationExtras) {
    this.opXtras = opXtras;
  }
  async setPaymentMod() {
    const modal = await this.modalController.create({
      component: SetPaymentChannelModalPage,
      cssClass: 'set-channel-payment-modal',
      backdropDismiss: true,
      swipeToClose: true,
      componentProps: {
        pass: this.opXtras.pass,
      },
    });
    modal.onDidDismiss().then(response => {
      let eventName = 'Buy_pass_payment_mod';
      if (response.data && response.data.paymentMod === PAYMENT_MOD_CREDIT) {
        this.paymentMod = PAYMENT_MOD_CREDIT;
        // pass internet, illimix, allo, ...
        this.payWithCredit();

        this.followAnalyticsService.registerEventFollow(eventName, 'event', PAYMENT_MOD_CREDIT);
      }
      if (response.data && response.data.paymentMod === PAYMENT_MOD_OM) {
        this.paymentMod = PAYMENT_MOD_OM;
        this.openPinpad();
        this.followAnalyticsService.registerEventFollow(eventName, 'event', PAYMENT_MOD_OM);
      }
    });
    return await modal.present();
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      backdropDismiss: true,
      swipeToClose: true,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: this.opXtras.purchaseType,
        buyPassPayload: {
          destinataire: this.opXtras.recipientMsisdn,
          pass: this.opXtras.pass,
        },
        opXtras: this.opXtras,
      },
    });
    modal.onDidDismiss().then(response => {
      if (response.data && response.data.success) {
        this.openSuccessFailModal(
          {
            opXtras: response.data.opXtras,
            historyTransactionItem: response.data.transferToBlock,
            success: true,
            msisdnBuyer: this.orangeMoneyService.getOrangeMoneyNumber(),
            buyForMe: this.opXtras.recipientMsisdn === this.orangeMoneyService.getOrangeMoneyNumber(),
          },
          response.data.operationPayload
        );
      }
    });
    return await modal.present();
  }

  async openSuccessFailModal(params: ModalSuccessModel, orangeMoneyData?: any) {
    params.passBought = this.opXtras.pass;
    params.paymentMod = this.paymentMod;
    params.recipientMsisdn = this.opXtras.recipientMsisdn;
    params.recipientName = this.recipientName;
    params.purchaseType = this.opXtras.purchaseType;
    params.amount = this.amount;
    params.merchantCode = this.merchantCode;
    params.merchantName = this.merchantName;
    params.dalal = this.opXtras ? this.opXtras.dalal : null;
    params.opXtras = this.opXtras;
    const modal = await this.modalController.create({
      component: OperationSuccessFailModalPage,
      cssClass: 'success-or-fail-modal',
      componentProps: params,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(res => {
      if (orangeMoneyData) {
        this.suggestFaceId(orangeMoneyData);
      }
    });
    return await modal.present();
  }

  async payWithCredit(hmac?: string) {
    this.buyingPass = true;
    const codeIN = this.opXtras.pass.passPromo
      ? this.opXtras.pass.passPromo.price_plan_index
      : this.opXtras.pass.price_plan_index;
    const amount = this.opXtras.pass.passPromo ? +this.opXtras.pass.passPromo.tarif : +this.opXtras.pass.tarif;
    const msisdn = this.currentUserNumber;
    const receiver = this.opXtras.recipientMsisdn;
    const type = this.opXtras.purchaseType === OPERATION_TYPE_PASS_INTERNET ? 'internet' : 'illimix';
    const payload: BuyPassModel = {
      type,
      codeIN,
      amount,
      msisdn,
      receiver,
    };
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: msisdn,
      receiver: receiver,
      montant: amount,
      ppi: codeIN,
      isPassFavori: !!this.opXtras?.pass?.isFavoritePass,
    };
    const loader = await this.presentLoadingWithOptions();
    loader.present();
    this.dashboardService.buyPassByCredit(payload, hmac).subscribe(
      (res: any) => {
        loader.dismiss();
        this.transactionSuccessful(res, logInfos);
      },
      (err: any) => {
        loader.dismiss();
        this.transactionFailure(err, logInfos);
      }
    );
  }

  async presentLoadingWithOptions() {
    const loading = await this.loaderCtl.create({
      spinner: 'crescent',
      message: 'Veuillez patienter',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: false,
    });
    return loading;
  }

  async suggestFaceId(operationData?) {
    const status = await this.orangeMoneyService.checkFaceIdStatus();
    if (status === FACE_ID_PERMISSIONS.LATER || !status) {
      const modal = await this.modalController.create({
        component: FaceIdRequestModalComponent,
        cssClass: 'select-recipient-modal',
        backdropDismiss: true,
        componentProps: { operationData },
      });
      modal.onDidDismiss().then(() => {});
      return await modal.present();
    }
  }

  transactionSuccessful(res: any, logInfos: FollowOemlogPurchaseInfos) {
    this.buyingPass = false;
    if (res.code !== '0') {
      this.buyPassFailed = true;
      this.buyPassErrorMsg = res.message;
      const followDetails = Object.assign({}, logInfos, {
        error_code: res.code,
      });
      this.sendFollowLogs('error', this.opXtras.purchaseType, followDetails);
    } else {
      this.buyPassFailed = false;
      const followDetails = logInfos;
      this.sendFollowLogs('event', this.opXtras.purchaseType, followDetails);
    }
    this.openSuccessFailModal({
      success: !this.buyPassFailed,
      msisdnBuyer: this.dashboardService.getCurrentPhoneNumber(),
      buyForMe: this.opXtras.recipientMsisdn === this.dashboardService.getCurrentPhoneNumber(),
      errorMsg: this.buyPassErrorMsg,
      errorCode: res?.code,
      recipientMsisdn: this.opXtras.recipientMsisdn,
    });
  }

  transactionFailure(err: any, logInfos: FollowOemlogPurchaseInfos) {
    this.buyingPass = false;
    // this.openSuccessFailModal({ success: false });
    this.buyPassErrorMsg =
      err.error && err.error.message ? err.error.message : 'Service indisponible. Veuillez réessayer ultérieurement';
    const followDetails = Object.assign({}, logInfos, {
      error_code: err.status,
    });
    this.sendFollowLogs('error', this.opXtras.purchaseType, followDetails);
    this.openSuccessFailModal({
      success: false,
      msisdnBuyer: this.dashboardService.getCurrentPhoneNumber(),
      buyForMe: this.opXtras.recipientMsisdn === this.dashboardService.getCurrentPhoneNumber(),
      errorMsg: this.buyPassErrorMsg,
      errorCode: err?.error?.code,
      recipientMsisdn: this.opXtras.recipientMsisdn,
    });
  }

  sendFollowLogs(type: 'event' | 'error', purchaseType: string, logDetails: any) {
    let eventName;
    switch (purchaseType) {
      case OPERATION_TYPE_PASS_INTERNET:
        eventName = 'Achat_Pass_internet';
        break;
      case OPERATION_TYPE_PASS_USAGE:
        eventName = `Achat_Pass_usage_${this.opXtras.serviceUsage.code.toLowerCase()}`;
        break;
      case OPERATION_TYPE_PASS_ILLIMIX:
        eventName = 'Achat_Pass_illimix';
        break;
      case OPERATION_TYPE_PASS_VOYAGE:
        eventName = 'Achat_Pass_voyage';
        break;
      case OPERATION_TYPE_PASS_ILLIFLEX:
        eventName = 'Achat_Pass_illiflex';
        break;
      case OPERATION_ENABLE_DALAL:
        eventName = 'Dalal_activation';
        break;
      default:
        break;
    }
    if (this.opXtras && this.opXtras.fromPage === OPERATION_TYPE_BONS_PLANS) eventName += '_bons_plans';
    eventName += type === 'event' ? '_Success' : '_Error';
    console.log('followSuccess', logDetails, 'op', purchaseType, eventName);
    this.followAnalyticsService.registerEventFollow(eventName, type, logDetails);
  }
}
