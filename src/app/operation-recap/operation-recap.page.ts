import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SetPaymentChannelModalPage } from '../set-payment-channel-modal/set-payment-channel-modal.page';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyPassModel } from '../services/dashboard-service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
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
  CODE_PARTENAIRE_COUPON_TRACE_TV,
  OPERATION_TYPE_PASS_INTERNATIONAL,
  OPERATION_PAY_ORANGE_BILLS,
  BALANCE_INSUFFICIENT_ERROR,
  OPERATION_ABONNEMENT_WIDO,
  PAYMENT_MOD_BANK_CARD,
} from 'src/shared';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { OperationSuccessFailModalPage } from '../operation-success-fail-modal/operation-success-fail-modal.page';
import { FACE_ID_PERMISSIONS, OM_FEES_CALCUL_MODE, OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { OperationExtras } from '../models/operation-extras.model';
import {
  OPERATION_RAPIDO,
  OPERATION_XEWEUL,
  OPERATION_TYPE_INTERNATIONAL_TRANSFER,
  OPERATION_TYPE_PASS_USAGE,
  OPERATION_TYPE_PAY_BILL,
  OPERATION_TYPE_SENEAU_BILLS,
  OPERATION_TYPE_SENELEC_BILLS,
  OPERATION_TYPE_TERANGA_BILL,
  OPERATION_WOYOFAL,
} from '../utils/operations.constants';
import { OfferPlan } from 'src/shared/models/offer-plan.model';
import { PROFILE_TYPE_POSTPAID } from '../dashboard';
import { DalalTonesService } from '../services/dalal-tones-service/dalal-tones.service';
import { IlliflexService } from '../services/illiflex-service/illiflex.service';
import { PassInternetService } from '../services/pass-internet-service/pass-internet.service';
import { ModalSuccessModel } from '../models/modal-success-infos.model';
import { SetRecipientNamesModalComponent } from './set-recipient-names-modal/set-recipient-names-modal.component';
import { of, throwError } from 'rxjs';
import { BoosterService } from '../services/booster.service';
import { FeeModel } from '../services/orange-money-service';
import { FeesService } from '../services/fees/fees.service';
import { OM_LABEL_SERVICES } from '../utils/bills.util';
import { FollowOemlogPurchaseInfos } from '../models/follow-log-oem-purchase-Infos.model';
import { BoosterModel } from '../models/booster.model';
import { FaceIdRequestModalComponent } from 'src/shared/face-id-request-modal/face-id-request-modal.component';
import { catchError, tap } from 'rxjs/operators';
import { PassAbonnementWidoService } from '../services/pass-abonnement-wido-service /pass-abonnement-wido.service';
import { ANALYTICS_PROVIDER, OemLoggingService } from '../services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from '../utils/utils';
import { BillPaymentCbModel } from '../models/bill-payment.model';
import { BillsService } from '../services/bill-service/bills.service';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: "app-operation-recap",
  templateUrl: "./operation-recap.page.html",
  styleUrls: ["./operation-recap.page.scss"],
})
export class OperationRecapPage implements OnInit {
  static ROUTE_PATH = "/operation-recap";
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
    country?: any;
    reason?: string;
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
  OPERATION_TYPE_PASS_VOYAGE = OPERATION_TYPE_PASS_VOYAGE;
  OPERATION_TYPE_PASS_INTERNATIONAL = OPERATION_TYPE_PASS_INTERNATIONAL;
  OPERATION_TYPE_PASS_USAGE = OPERATION_TYPE_PASS_USAGE;
  OPERATION_RAPIDO = OPERATION_RAPIDO;
  OPERATION_XEWEUL = OPERATION_XEWEUL;
  OPERATION_PAY_ORANGE_BILLS = OPERATION_PAY_ORANGE_BILLS;
  OPERATION_TYPE_INTERNATIONAL_TRANSFER = OPERATION_TYPE_INTERNATIONAL_TRANSFER;
  OPERATION_TYPE_PAY_BILL = OPERATION_TYPE_PAY_BILL;
  OPERATION_TYPE_TERANGA_BILL = OPERATION_TYPE_TERANGA_BILL;
  OPERATION_TYPE_SENELEC_BILLS = OPERATION_TYPE_SENELEC_BILLS;
  OPERATION_TYPE_SENEAU_BILLS = OPERATION_TYPE_SENEAU_BILLS;
  OPERATION_ABONNEMENT_WIDO = OPERATION_ABONNEMENT_WIDO;
  DALAL_TARIF = MONTHLY_DALAL_TARIF;
  OM_FEES_CALCUL_MODE = OM_FEES_CALCUL_MODE;
  subscriptionInfos: SubscriptionModel;
  buyCreditPayload: any;
  offerPlan: OfferPlan;
  isLightMod: boolean;
  checkingAmount: boolean;
  error: string;
  isIos: boolean;
  constructor(
    public modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private oemLoggingService: OemLoggingService,
    private appRouting: ApplicationRoutingService,
    private orangeMoneyService: OrangeMoneyService,
    private navController: NavController,
    private authServ: AuthenticationService,
    private dalalTonesService: DalalTonesService,
    private illiflexService: IlliflexService,
    private passService: PassInternetService,
    private ref: ChangeDetectorRef,
    private feeService: FeesService,
    private passAbonnementWido: PassAbonnementWidoService,
    private billsService: BillsService,
    private iab: InAppBrowser
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
          console.log(this.opXtras);

          this.purchaseType = this.opXtras.purchaseType;
          this.isLightMod = this.opXtras.isLightMod;
          this.recipientMsisdn = this.opXtras.recipientMsisdn;
          this.recipientName = this.opXtras.recipientName;

          switch (this.purchaseType) {
            case OPERATION_TYPE_PASS_INTERNET:
            case OPERATION_TYPE_PASS_ILLIMIX:
            case OPERATION_TYPE_PASS_ALLO:
            case OPERATION_TYPE_PASS_ILLIFLEX:
            case OPERATION_ABONNEMENT_WIDO:
              this.passChoosen = this.opXtras.pass;
              this.recipientCodeFormule = this.opXtras.recipientCodeFormule;
              this.buyPassPayload = {
                destinataire: this.recipientMsisdn,
                pass: this.passChoosen,
              };
              this.offerPlan = this.opXtras.offerPlan;
              break;
            case OPERATION_TYPE_PASS_VOYAGE:
            case OPERATION_TYPE_PASS_INTERNATIONAL:
              this.recipientName = this.opXtras.recipientFromContact
                ? this.opXtras.recipientFirstname +
                  " " +
                  this.opXtras.recipientLastname
                : "";
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
                this.recipientFirstName + " " + this.recipientLastName;
              this.paymentMod = PAYMENT_MOD_OM;
              break;
            case OPERATION_TRANSFER_OM:
            case OPERATION_TYPE_INTERNATIONAL_TRANSFER:
              this.amount = this.opXtras.amount;
              this.transferOMPayload.amount = this.amount;
              this.transferOMPayload.msisdn2 = this.recipientMsisdn;
              this.transferOMPayload.a_ma_charge = this.opXtras.includeFee;
              this.transferOMPayload.send_fees = this.opXtras.sending_fees;
              this.transferOMPayload.cashout_fees = this.opXtras.fee;
              this.transferOMPayload.country = this.opXtras.country;
              this.transferOMPayload.reason = this.opXtras.reason;
              if (this.purchaseType === OPERATION_TRANSFER_OM)
                this.recipientName =
                  this.opXtras.recipientFirstname +
                  " " +
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
                  " " +
                  this.opXtras.recipientLastname
                : "";
              this.offerPlan = this.opXtras.offerPlan;
              break;
            case OPERATION_RAPIDO:
            case OPERATION_XEWEUL:
            case OPERATION_WOYOFAL:
            case OPERATION_ENABLE_DALAL:
            case OPERATION_TYPE_PASS_USAGE:
            case OPERATION_TYPE_PAY_BILL:
            case OPERATION_TYPE_TERANGA_BILL:
            case OPERATION_TYPE_SENELEC_BILLS:
            case OPERATION_TYPE_SENEAU_BILLS:
            case OPERATION_PAY_ORANGE_BILLS:
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
    const pricePlanIndex =
      +this.route.snapshot.paramMap.get("ppi") || history?.state?.ppi;
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
        passByPPi.passType === "INTERNET"
          ? OPERATION_TYPE_PASS_INTERNET
          : OPERATION_TYPE_PASS_ILLIMIX;
      this.passChoosen =
        passByPPi.passType === "INTERNET"
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
    let amount = +this.route.snapshot.paramMap.get("amount");
    const msisdn = this.route.snapshot.paramMap.get("msisdn");
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
          this.recipientFirstName + " " + this.recipientLastName;
        this.ref.detectChanges();
        return of(response).toPromise();
      } else {
        this.amount = amount;
        this.transferOMPayload.amount = this.amount;
        this.transferOMPayload.msisdn2 = this.recipientMsisdn;
        this.ref.detectChanges();
        return of("hasOM").toPromise();
      }
    } else {
      return of(null).toPromise();
    }
  }

  async openSetRecipientNamesModal(): Promise<any> {
    const modal = await this.modalController.create({
      component: SetRecipientNamesModalComponent,
      cssClass: "select-recipient-modal",
      backdropDismiss: false,
    });
    await modal.present();
    let result = await modal.onDidDismiss();
    return of(result.data).toPromise();
  }

  mapWoyofalToTransferInput() {
    const opxtras = this.opXtras;
    opxtras.sending_fees = this.opXtras.fee;
    return opxtras;
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
      case OPERATION_TYPE_PASS_INTERNATIONAL:
      case OPERATION_TYPE_PASS_ILLIMIX:
      case OPERATION_TYPE_PASS_ALLO:
      case OPERATION_TYPE_PASS_ILLIFLEX:
      case OPERATION_ABONNEMENT_WIDO:
        if (this.isLightMod) {
          const hmac = this.authServ.getHmac();
          this.payWithCredit(hmac);
        } else if (this.subscriptionInfos?.profil === PROFILE_TYPE_POSTPAID) {
          this.paymentMod = PAYMENT_MOD_OM;
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
      case OPERATION_XEWEUL:
      case OPERATION_WOYOFAL:
      case OPERATION_TYPE_INTERNATIONAL_TRANSFER:
        this.openPinpad();
        break;
      case OPERATION_ENABLE_DALAL:
        this.activateDalal();
        break;
      case OPERATION_TYPE_PASS_USAGE:
        this.buyPassUsage();
        break;
      case OPERATION_TYPE_TERANGA_BILL:
      case OPERATION_TYPE_SENELEC_BILLS:
      case OPERATION_TYPE_SENEAU_BILLS:
        const amountTocheck =
          this.purchaseType === OPERATION_TYPE_SENELEC_BILLS ||
          this.purchaseType === OPERATION_TYPE_SENEAU_BILLS
            ? this.opXtras?.invoice?.montantFacture +
              this.opXtras?.fee?.effective_fees
            : this.opXtras?.invoice?.montantFacture;
        this.checkOMBalanceSuffiency(amountTocheck);
      case OPERATION_TYPE_PAY_BILL:
        this.setPaymentMod();
      default:
        break;
    }
  }

  suscribeToWido(recipientMsisdn: string, ppi: string, logInfos: any) {
    this.passAbonnementWido
      .suscribeToWido({
        msisdn: recipientMsisdn,
        packId: +ppi,
        contentId: +this.passChoosen?.contentId,
      })
      .pipe(
        tap((res) => {
          this.transactionSuccessful({ code: "0" }, logInfos);
        }),
        catchError((err) => {
          this.transactionFailure(err, logInfos);
          return throwError(err);
        })
      )
      .subscribe();
  }

  activateDalal() {
    this.buyingPass = true;
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: this.currentUserNumber,
      montant: this.opXtras.dalal.tarif,
      ppi: this.opXtras.dalal.cid,
      mod_paiement: PAYMENT_MOD_CREDIT,
    };
    this.dalalTonesService.activateDalal(this.opXtras.dalal).subscribe(
      () => {
        this.buyingPass = false;
        this.sendFollowLogs("event", this.purchaseType, logInfos);
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
            : "Une erreur est survenue";
        const followDetails = Object.assign({}, logInfos, {
          error_code: err.status,
        });
        this.sendFollowLogs("error", this.purchaseType, followDetails);
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
    let passIlliflex =
      this.purchaseType === OPERATION_TYPE_PASS_ILLIFLEX
        ? this.passChoosen
        : null;
    const modal = await this.modalController.create({
      component: SetPaymentChannelModalPage,
      cssClass: "set-channel-payment-modal",
      componentProps: {
        pass: this.passChoosen,
        purchaseType: this.purchaseType,
        passIlliflex,
        canPayBillsByCB: this.opXtras?.canPayBillsByCB
      },
    });
    modal.onDidDismiss().then((response) => {
      let eventName =
        this.purchaseType === OPERATION_TYPE_PASS_ILLIFLEX
          ? "Buy_illiflex_payment_mod"
          : "Buy_pass_payment_mod";
      if (this.purchaseType === OPERATION_TYPE_PAY_BILL) {
        this.paymentMod = response?.data?.paymentMod;
        if (this.paymentMod === PAYMENT_MOD_BANK_CARD) {
          this.initPaymentByCB();
        } else if (this.paymentMod === PAYMENT_MOD_OM) {
          this.checkOMBalanceSuffiency(this.opXtras?.invoice?.montantFacture);
        }
        return;
      }
      if (response.data && response.data.paymentMod === PAYMENT_MOD_CREDIT) {
        this.paymentMod = PAYMENT_MOD_CREDIT;
        if (this.purchaseType === OPERATION_TYPE_PASS_ILLIFLEX) {
          this.payIlliflex();
        } else {
          // pass internet, illimix, allo, ...
          this.payWithCredit();
        }
        this.oemLoggingService.registerEvent(
          eventName,
          convertObjectToLoggingPayload({ paymentMod: PAYMENT_MOD_CREDIT })
        );
      }
      if (response.data && response.data.paymentMod === PAYMENT_MOD_OM) {
        this.paymentMod = PAYMENT_MOD_OM;
        this.openPinpad();
        this.oemLoggingService.registerEvent(
          eventName,
          convertObjectToLoggingPayload({ paymentMod: PAYMENT_MOD_OM })
        );
      }
    });
    return await modal.present();
  }

  initPaymentByCB() {
    this.buyingPass = true;
    const invoice = this.opXtras.invoice;
    this.authServ
      .getSubscriptionForTiers(invoice.numeroTelephone)
      .pipe(
        tap((sub) => {
          const nclient = sub?.clientCode;
          const paymentInitPayload: BillPaymentCbModel = {
            nclient,
            billingAccountId: invoice?.numeroTelephone,
            billNumber: invoice?.nfact,
            payerMsisdn: this.currentUserNumber,
            paymentCategory: "FIXE",
            paymentAmount: invoice?.montantFacture.toString(),
          };
          this.billsService
            .initBilPaymentByBankCard(paymentInitPayload)
            .pipe(
              tap((res) => {
                this.openInAppBrowser(res.paymentUrl);
                this.buyingPass = false;
              }),
              catchError((err) => {
                this.buyingPass = false;
                console.log(err);
                return throwError(err);
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  openInAppBrowser(url: string) {
    const options: InAppBrowserOptions = this.isIos
      ? {
          location: 'no',
          toolbar: 'yes',
          toolbarcolor: '#CCCCCC',
          toolbarposition: 'top',
          toolbartranslucent: 'no',
          closebuttoncolor: '#000000',
          closebuttoncaption: 'Fermer',
          hidespinner: 'yes',
        }
      : {};
    this.iab
      .create(url, '_blank', options)
      .on('exit')
      .subscribe(event => {
        this.router.navigate(["/"])
      });
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      backdropDismiss: true,
      swipeToClose: true,
      cssClass: "pin-pad-modal",
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
        illiflexPayload: this.passChoosen,
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response.data && response.data.success) {
        this.openSuccessFailModal(
          {
            opXtras: response.data.opXtras,
            historyTransactionItem: response.data.transferToBlock,
            success: true,
            msisdnBuyer: this.orangeMoneyService.getOrangeMoneyNumber(),
            buyForMe:
              this.recipientMsisdn ===
              this.orangeMoneyService.getOrangeMoneyNumber(),
          },
          response.data.operationPayload
        );
      }
    });
    return await modal.present();
  }

  async openSuccessFailModal(params: ModalSuccessModel, orangeMoneyData?: any) {
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
      cssClass: "success-or-fail-modal",
      componentProps: params,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((res) => {
      if (orangeMoneyData) {
        this.suggestFaceId(orangeMoneyData);
      }
    });
    return await modal.present();
  }

  async suggestFaceId(operationData?) {
    const status = await this.orangeMoneyService.checkFaceIdStatus();
    if (status === FACE_ID_PERMISSIONS.LATER || !status) {
      const modal = await this.modalController.create({
        component: FaceIdRequestModalComponent,
        cssClass: "select-recipient-modal",
        backdropDismiss: true,
        componentProps: { operationData },
      });
      modal.onDidDismiss().then(() => {});
      return await modal.present();
    }
  }

  getPassBoosters(pass: any) {
    return getActiveBoostersForSpecificPass(
      pass,
      BoosterService.lastBoostersList
    );
  }

  isBoosterTraceTV() {
    if (this.passChoosen) {
      const boosters = this.getPassBoosters(this.passChoosen);
      return !!boosters.find((item: BoosterModel) => {
        return item?.gift?.partner?.code === CODE_PARTENAIRE_COUPON_TRACE_TV;
      });
    }
    return null;
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
        ? "internet"
        : "illimix";
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
    };
    switch (this.purchaseType) {
      case OPERATION_ABONNEMENT_WIDO:
        this.suscribeToWido(payload.receiver, payload.codeIN, logInfos);
        break;
      default:
        this.dashboardService.buyPassByCredit(payload, hmac).subscribe(
          (res: any) => {
            this.transactionSuccessful(res, logInfos);
          },
          (err: any) => {
            this.transactionFailure(err, logInfos);
          }
        );
        break;
    }
  }

  buyPassUsage() {
    this.buyingPass = true;
    const payload: BuyPassModel = {
      codeIN: this.opXtras.pass.price_plan_index,
      amount: this.opXtras.pass.tarif,
      receiver: this.opXtras.recipientMsisdn,
      msisdn: this.currentUserNumber,
      serviceId: this.opXtras.pass.serviceId,
      type: "usage",
      serviceType: this.opXtras.pass.typeUsage.code,
    };
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: this.currentUserNumber,
      receiver: this.opXtras.recipientMsisdn,
      montant: this.opXtras.pass.tarif,
      ppi: this.opXtras.pass.price_plan_index,
    };
    this.dashboardService.buyPassByCredit(payload).subscribe(
      (res) => {
        this.transactionSuccessful(res, logInfos);
      },
      (err) => {
        this.transactionFailure(err, logInfos);
      }
    );
  }

  payIlliflex() {
    this.buyingPass = true;
    const logInfos: FollowOemlogPurchaseInfos = {
      sender: this.currentUserNumber,
      receiver: this.recipientMsisdn,
      montant: this.passChoosen.amount,
      mod_paiement: PAYMENT_MOD_CREDIT,
    };
    this.illiflexService.buyIlliflex(this.passChoosen).subscribe(
      () => {
        this.buyingPass = false;
        this.sendFollowLogs("event", this.purchaseType, logInfos);
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
        const followDetails = Object.assign({}, logInfos, {
          error_code: err.status,
        });
        this.sendFollowLogs("error", this.purchaseType, followDetails);
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

  transactionSuccessful(res: any, logInfos: FollowOemlogPurchaseInfos) {
    this.buyingPass = false;
    if (res.code !== "0") {
      this.buyPassFailed = true;
      this.buyPassErrorMsg = res.message;
      const followDetails = Object.assign({}, logInfos, {
        error_code: res.code,
      });
      this.sendFollowLogs("error", this.purchaseType, followDetails);
    } else {
      this.buyPassFailed = false;
      const followDetails = logInfos;
      this.sendFollowLogs("event", this.purchaseType, followDetails);
    }
    this.openSuccessFailModal({
      success: !this.buyPassFailed,
      msisdnBuyer: this.dashboardService.getCurrentPhoneNumber(),
      buyForMe:
        this.recipientMsisdn === this.dashboardService.getCurrentPhoneNumber(),
      errorMsg: this.buyPassErrorMsg,
      errorCode: res?.code,
      recipientMsisdn: this.recipientMsisdn,
    });
  }

  transactionFailure(err: any, logInfos: FollowOemlogPurchaseInfos) {
    this.buyingPass = false;
    this.buyPassErrorMsg =
      err.error && err.error.message
        ? err.error.message || err?.error?.respMsg
        : "Service indisponible. Veuillez réessayer ultérieurement";
    if (err?.error?.respMsg) {
      this.buyPassErrorMsg = err?.error?.respMsg;
    }
    const followDetails = Object.assign({}, logInfos, {
      error_code: err.status,
    });
    this.sendFollowLogs("error", this.purchaseType, followDetails);
    this.openSuccessFailModal({
      success: false,
      msisdnBuyer: this.dashboardService.getCurrentPhoneNumber(),
      buyForMe:
        this.recipientMsisdn === this.dashboardService.getCurrentPhoneNumber(),
      errorMsg: this.buyPassErrorMsg,
      errorCode: err?.error?.code,
      recipientMsisdn: this.recipientMsisdn,
    });
  }

  get operationTypeRecap() {
    return [
      "RECHARGEMENT_CREDIT",
      OPERATION_TYPE_PASS_VOYAGE,
      "OPERATION_WOYOFAL",
      OPERATION_RAPIDO,
      OPERATION_XEWEUL,
    ].includes(this.purchaseType);
  }

  sendFollowLogs(
    type: "event" | "error",
    purchaseType: string,
    logDetails: any
  ) {
    let eventName;
    switch (purchaseType) {
      case OPERATION_TYPE_PASS_INTERNET:
        eventName = "Achat_Pass_internet";
        break;
      case OPERATION_TYPE_PASS_USAGE:
        eventName = `Achat_Pass_usage_${this.opXtras.serviceUsage.code.toLowerCase()}`;
        break;
      case OPERATION_TYPE_PASS_ILLIMIX:
        eventName = "Achat_Pass_illimix";
        break;
      case OPERATION_TYPE_PASS_VOYAGE:
        eventName = "Achat_Pass_voyage";
        break;
      case OPERATION_TYPE_PASS_ILLIFLEX:
        eventName = "Achat_Pass_illiflex";
        break;
      case OPERATION_ENABLE_DALAL:
        eventName = "Dalal_activation";
        break;
      case OPERATION_ABONNEMENT_WIDO:
        eventName = "Achat_abonnement_wido";
        break;
      default:
        break;
    }
    if (this.opXtras && this.opXtras.fromPage === OPERATION_TYPE_BONS_PLANS)
      eventName += "_bons_plans";
    eventName += type === "event" ? "_Success" : "_Error";
    console.log("followSuccess", logDetails, "op", purchaseType, eventName);
    this.oemLoggingService.registerEvent(
      eventName,
      convertObjectToLoggingPayload(logDetails),
      ANALYTICS_PROVIDER.ALL
    );
  }

  checkOMBalanceSuffiency(amount) {
    this.checkingAmount = true;
    this.error = null;
    this.orangeMoneyService.checkBalanceSufficiency(amount).subscribe(
      (hasEnoughBalance) => {
        this.checkingAmount = false;
        if (hasEnoughBalance) {
          this.openPinpad();
        } else {
          this.error = BALANCE_INSUFFICIENT_ERROR;
        }
      },
      (err) => {
        this.checkingAmount = false;
        this.openPinpad();
      }
    );
  }
}
