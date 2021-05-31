import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  OPERATION_TYPE_PASS_ILLIFLEX,
  getActiveBoostersForSpecificPass,
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
import { IlliflexService } from '../services/illiflex-service/illiflex.service';
import { PassInternetService } from '../services/pass-internet-service/pass-internet.service';
import { ModalSuccessModel } from '../models/modal-success-infos.model';
import { SetRecipientNamesModalComponent } from './set-recipient-names-modal/set-recipient-names-modal.component';
import { of } from 'rxjs';
import { BoosterService } from '../services/booster.service';
import { FeeModel } from '../services/orange-money-service';
import { FeesService } from '../services/fees/fees.service';
import { OM_LABEL_SERVICES } from '../utils/bills.util';

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
  transferOMPayload: {
    amount: number;
    msisdn2: string;
    send_fees: number;
    cashout_fees: number;
    a_ma_charge: boolean;
  } = {
    amount: null,
    msisdn2: null,
    send_fees: null,
    cashout_fees: null,
    a_ma_charge: null,
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
  OPERATION_ILLIFLEX = OPERATION_TYPE_PASS_ILLIFLEX;
  OPERATION_RAPIDO = OPERATION_RAPIDO;
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
    private dalalTonesService: DalalTonesService,
    private illiflexService: IlliflexService,
    private passService: PassInternetService,
    private ref: ChangeDetectorRef,
    private feeService: FeesService
  ) {}

  ngOnInit() {
    this.currentUserNumber = this.dashboardService.getCurrentPhoneNumber();
    this.getCurrentNumSubscription();
    if (this.route)
      this.route.queryParams.subscribe(async () => {
        if (this.router.getCurrentNavigation()) {
          const isTransferDeeplink = await this.checkTransferOMDeeplink();
          if (isTransferDeeplink) return;
          const pricePlanIndex = await this.checkBuyPassDeeplink();
          if (pricePlanIndex) return;
          this.opXtras = history.state;
          this.purchaseType = this.opXtras.purchaseType;
          this.isLightMod = this.opXtras.isLightMod;
          this.recipientMsisdn = this.opXtras.recipientMsisdn;
          switch (this.purchaseType) {
            case OPERATION_TYPE_PASS_INTERNET:
            case OPERATION_TYPE_PASS_ILLIMIX:
            case OPERATION_TYPE_PASS_ALLO:
            case OPERATION_TYPE_PASS_ILLIFLEX:
              this.recipientName = this.opXtras.recipientName;
              this.passChoosen = this.opXtras.pass;
              this.recipientCodeFormule = this.opXtras.recipientCodeFormule;
              this.buyPassPayload = {
                destinataire: this.recipientMsisdn,
                pass: this.passChoosen,
              };
              this.offerPlan = this.opXtras.offerPlan;
              break;
            case OPERATION_TYPE_PASS_VOYAGE:
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
              this.offerPlan = this.opXtras.offerPlan;
              break;
            case OPERATION_TRANSFER_OM_WITH_CODE:
              this.amount = this.opXtras.amount + this.opXtras.fee;
              this.transferOMWithCodePayload.amount = this.opXtras.amount;
              this.transferOMWithCodePayload.msisdn2 = this.recipientMsisdn;
              this.transferOMWithCodePayload.prenom_receiver =
                this.opXtras.recipientFirstname;
              this.transferOMWithCodePayload.nom_receiver =
                this.opXtras.recipientLastname;
              this.recipientFirstName = this.opXtras.recipientFirstname;
              this.recipientLastName = this.opXtras.recipientLastname;
              this.recipientName =
                this.recipientFirstName + ' ' + this.recipientLastName;
              this.paymentMod = PAYMENT_MOD_OM;
              break;
            case OPERATION_TRANSFER_OM:
              this.amount = this.opXtras.amount;
              this.transferOMPayload.amount = this.amount;
              this.transferOMPayload.msisdn2 = this.recipientMsisdn;
              this.transferOMPayload.a_ma_charge = this.opXtras.includeFee;
              this.transferOMPayload.send_fees = this.opXtras.sending_fees;
              this.transferOMPayload.cashout_fees = this.opXtras.fee;
              this.recipientName =
                this.opXtras.recipientFirstname +
                ' ' +
                this.opXtras.recipientLastname;
              this.paymentMod = PAYMENT_MOD_OM;
              break;
            case OPERATION_TYPE_MERCHANT_PAYMENT:
              this.amount = this.opXtras.amount;
              this.merchantCode = this.opXtras.merchant.merchantCode;
              this.merchantName = this.opXtras.merchant.name;
              this.paymentMod = PAYMENT_MOD_OM;
              this.merchantPaymentPayload = {
                amount: this.amount,
                code_marchand: this.merchantCode,
                nom_marchand: this.merchantName,
              };
              break;
            case OPERATION_TYPE_RECHARGE_CREDIT:
              this.amount = this.opXtras.amount;
              this.paymentMod = PAYMENT_MOD_OM;
              this.recipientName = this.opXtras.recipientFromContact
                ? this.opXtras.recipientFirstname +
                  ' ' +
                  this.opXtras.recipientLastname
                : '';
              this.offerPlan = this.opXtras.offerPlan;
              break;
            case OPERATION_RAPIDO:
            case OPERATION_WOYOFAL:
            case OPERATION_ENABLE_DALAL:
              break;
            default:
              this.appRouting.goToDashboard();
              break;
          }
          this.ref.detectChanges();
        }
      });
  }

  async checkBuyPassDeeplink(): Promise<any> {
    const pricePlanIndex = +this.route.snapshot.paramMap.get('ppi');
    if (pricePlanIndex) {
      const passByPPi: any = await this.passService.getPassByPPI(
        pricePlanIndex
      );
      if (passByPPi.error) {
        this.appRouting.goToDashboard();
        return;
      }
      this.recipientMsisdn = this.currentUserNumber;
      this.purchaseType =
        passByPPi.passType === 'INTERNET'
          ? OPERATION_TYPE_PASS_INTERNET
          : OPERATION_TYPE_PASS_ILLIMIX;
      this.passChoosen =
        passByPPi.passType === 'INTERNET'
          ? passByPPi.passInternet
          : passByPPi.passIllimix;
      this.buyPassPayload = {
        destinataire: this.recipientMsisdn,
        pass: this.passChoosen,
      };
      this.ref.detectChanges();
      return of(pricePlanIndex).toPromise();
    } else {
      return of(null).toPromise();
    }
  }

  async checkTransferOMDeeplink() {
    let amount = +this.route.snapshot.paramMap.get('amount');
    const msisdn = this.route.snapshot.paramMap.get('msisdn');
    if (msisdn) {
      const msisdnHasOM = await this.orangeMoneyService
        .checkUserHasAccount(msisdn)
        .toPromise();
      this.purchaseType = msisdnHasOM
        ? OPERATION_TRANSFER_OM
        : OPERATION_TRANSFER_OM_WITH_CODE;
      this.recipientMsisdn = msisdn;
      this.paymentMod = PAYMENT_MOD_OM;
      if (!msisdnHasOM) {
        const fees = await this.feeService
          .getFeesByOMService(OM_LABEL_SERVICES.TRANSFERT_AVEC_CODE, msisdn)
          .toPromise();
        const fee = fees.find(
          (fee: FeeModel) => amount <= fee.max && amount >= fee.min
        );
        amount = fee ? amount + fee.effective_fees : amount;
        const response = await this.openSetRecipientNamesModal();
        this.amount = amount;
        this.transferOMWithCodePayload.amount = amount;
        this.transferOMWithCodePayload.msisdn2 = msisdn;
        this.transferOMWithCodePayload.prenom_receiver =
          response.recipientFirstname;
        this.transferOMWithCodePayload.nom_receiver =
          response.recipientLastname;
        this.recipientFirstName = response.recipientFirstname;
        this.recipientLastName = response.recipientLastname;
        this.recipientName =
          this.recipientFirstName + ' ' + this.recipientLastName;
        this.ref.detectChanges();
        return of(response).toPromise();
      } else {
        this.amount = amount;
        this.transferOMPayload.amount = this.amount;
        this.transferOMPayload.msisdn2 = this.recipientMsisdn;
        this.ref.detectChanges();
        return of('hasOM').toPromise();
      }
    } else {
      return of(null).toPromise();
    }
  }

  async openSetRecipientNamesModal(): Promise<any> {
    const modal = await this.modalController.create({
      component: SetRecipientNamesModalComponent,
      cssClass: 'select-recipient-modal',
      backdropDismiss: false,
    });
    await modal.present();
    let result = await modal.onDidDismiss();
    return of(result.data).toPromise();
  }

  getCurrentNumSubscription() {
    this.authServ
      .getSubscriptionForTiers(this.currentUserNumber)
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
      case OPERATION_TYPE_PASS_ILLIFLEX:
        this.payIlliflex();
        break;
      default:
        break;
    }
  }

  activateDalal() {
    this.buyingPass = true;
    this.dalalTonesService.activateDalal(this.opXtras.dalal).subscribe(
      () => {
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
    params.opXtras = this.opXtras;
    const modal = await this.modalController.create({
      component: OperationSuccessFailModalPage,
      cssClass: 'success-or-fail-modal',
      componentProps: params,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }

  getPassBoosters(pass: any) {
    return getActiveBoostersForSpecificPass(
      pass,
      BoosterService.lastBoostersList
    );
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
      (err: any) => {
        this.transactionFailure(err);
      }
    );
  }

  payIlliflex() {
    this.buyingPass = true;
    this.illiflexService.buyIlliflex(this.passChoosen).subscribe(
      () => {
        this.buyingPass = false;
        this.openSuccessFailModal({
          success: true,
          msisdnBuyer: this.recipientMsisdn,
          buyForMe:
            this.recipientMsisdn ===
            this.dashboardService.getCurrentPhoneNumber(),
        });
      },
      (err) => {
        this.buyingPass = false;
        let errorMsg;
        if (err.status && err.status === 400) {
          errorMsg = `Vous n'avez pas assez de crédit de recharge pour effectuer cette opération`;
        } else {
          errorMsg = `Une erreur est survenue. Veuillez réessayer plus tard`;
        }
        this.openSuccessFailModal({
          success: false,
          msisdnBuyer: this.recipientMsisdn,
          errorMsg,
        });
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

  transactionFailure(err) {
    this.buyingPass = false;
    // this.openSuccessFailModal({ success: false });
    this.buyPassErrorMsg =
      err.error && err.error.message
        ? err.error.message
        : 'Service indisponible. Veuillez réessayer ultérieurement';
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
      OPERATION_RAPIDO,
    ].includes(this.purchaseType);
  }
}
