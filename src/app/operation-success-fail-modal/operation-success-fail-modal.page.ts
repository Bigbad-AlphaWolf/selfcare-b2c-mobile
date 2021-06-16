import { Component, OnInit, Input } from '@angular/core';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import {
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TRANSFER_OM_WITH_CODE,
  OPERATION_TRANSFER_OM,
  OPERATION_TYPE_MERCHANT_PAYMENT,
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TYPE_PASS_ALLO,
  OPERATION_ENABLE_DALAL,
  OPERATION_TYPE_PASS_ILLIFLEX,
  CODE_KIRENE_Formule,
  OPERATION_RECLAMATION_ERREUR_TRANSACTION_OM,
  getActiveBoostersForSpecificPass,
  OPERATION_CHANGE_PIN_OM,
  SubscriptionModel,
  OPERATION_TYPE_PASS_VOYAGE,
  OPERATION_BLOCK_TRANSFER,
  OPERATION_OPEN_OM_ACCOUNT,
  OPERATION_CANCEL_TRANSFERT_OM,
} from 'src/shared';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { OperationExtras } from '../models/operation-extras.model';
import {
  OPERATION_RAPIDO,
  OPERATION_TYPE_PASS_USAGE,
  OPERATION_WOYOFAL,
} from '../utils/operations.constants';
import { BillsHubPage } from '../pages/bills-hub/bills-hub.page';
import { DalalTonesPage } from '../dalal-tones/dalal-tones.page';
import { RapidoOperationPage } from '../pages/rapido-operation/rapido-operation.page';
import { BoosterService } from '../services/booster.service';
import { GiftType } from '../models/enums/gift-type.enum';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { PROFILE_TYPE_POSTPAID } from '../dashboard';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { catchError, tap } from 'rxjs/operators';
import { CheckEligibilityModel } from '../services/orange-money-service';
import { throwError } from 'rxjs';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { BlockTransferSuccessPopupComponent } from 'src/shared/block-transfer-success-popup/block-transfer-success-popup.component';

@Component({
  selector: 'app-operation-success-fail-modal',
  templateUrl: './operation-success-fail-modal.page.html',
  styleUrls: ['./operation-success-fail-modal.page.scss'],
})
export class OperationSuccessFailModalPage implements OnInit {
  OPERATION_INTERNET_TYPE = OPERATION_TYPE_PASS_INTERNET;
  OPERATION_ILLIMIX_TYPE = OPERATION_TYPE_PASS_ILLIMIX;
  OPERATION_ALLO_TYPE = OPERATION_TYPE_PASS_ALLO;
  OPERATION_TRANSFER_OM_WITH_CODE = OPERATION_TRANSFER_OM_WITH_CODE;
  OPERATION_TRANSFER_OM = OPERATION_TRANSFER_OM;
  OPERATION_TYPE_MERCHANT_PAYMENT = OPERATION_TYPE_MERCHANT_PAYMENT;
  OPERATION_TYPE_RECHARGE = OPERATION_TYPE_RECHARGE_CREDIT;
  OPERATION_ENABLE_DALAL = OPERATION_ENABLE_DALAL;
  OPERATION_ILLIFLEX_TYPE = OPERATION_TYPE_PASS_ILLIFLEX;
  OPERATION_RECLAMATION_ERREUR_TRANSACTION_OM =
    OPERATION_RECLAMATION_ERREUR_TRANSACTION_OM;
  OPERATION_CHANGE_PIN_OM = OPERATION_CHANGE_PIN_OM;
  OPERATION_TYPE_PASS_VOYAGE = OPERATION_TYPE_PASS_VOYAGE;
  OPERATION_TYPE_PASS_USAGE = OPERATION_TYPE_PASS_USAGE;
  OPERATION_OPEN_OM_ACCOUNT = OPERATION_OPEN_OM_ACCOUNT;
  OPERATION_CANCEL_TRANSFERT_OM = OPERATION_CANCEL_TRANSFERT_OM;
  OPERATION_RAPIDO = OPERATION_RAPIDO;
  @Input() passBought: any;
  @Input() success: boolean;
  @Input() recipientMsisdn: string;
  @Input() recipientName: string;
  @Input() buyForMe: boolean;
  @Input() paymentMod: string;
  @Input() msisdnBuyer: string;
  @Input() errorMsg: string;
  @Input() purchaseType: string;
  @Input() amount: number;
  @Input() merchantCode: number;
  @Input() merchantName: string;
  @Input() opXtras: OperationExtras;
  @Input() dalal: any;
  @Input() textMsg: any;
  dateAchat = this.dashboardService.getCurrentDate();
  btnText: string;
  coupon;
  hasCoupon: boolean;

  isBuyerPostpaid: boolean;
  @Input() isOpenedFromHistory: boolean;
  @Input() historyTransactionItem: any;
  checkingEligibility: boolean;
  eligibilityHasError: boolean;
  eligibilityError: string;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    public modalController: ModalController,
    private appRouting: ApplicationRoutingService,
    private navCtrl: NavController,
    private followAnalyticsServ: FollowAnalyticsService,
    private authenticationService: AuthenticationService,
    private omService: OrangeMoneyService
  ) {}

  ngOnInit() {
    this.checkifBuyerPostpaid();
  }

  checkTransferEligibility() {
    if (this.checkingEligibility) return true;
    const eventName = this.isOpenedFromHistory
      ? 'clic_block_transfer_from_history'
      : 'clic_block_transfer_after_transfer';
    this.followAnalyticsServ.registerEventFollow(eventName, 'event', {
      transaction: this.historyTransactionItem,
    });
    this.checkingEligibility = true;
    this.eligibilityHasError = false;
    this.omService
      .isTxnEligibleToBlock(this.historyTransactionItem.txnid)
      .pipe(
        tap((res: CheckEligibilityModel) => {
          this.checkingEligibility = false;
          if (res.eligible) {
            this.openPinPadToBlock();
          } else {
            this.eligibilityHasError = true;
            this.eligibilityError = res.message;
          }
        }),
        catchError((err) => {
          this.checkingEligibility = false;
          this.eligibilityHasError = true;
          this.eligibilityError = 'Une erreur est survenue';
          return throwError(err);
        })
      )
      .subscribe();
  }

  async openPinPadToBlock() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        transactionToBlock: this.historyTransactionItem,
        operationType: OPERATION_BLOCK_TRANSFER,
      },
    });
    modal.onDidDismiss().then(async (response) => {
      if (response.data && response.data.success) {
        await this.modalController.dismiss();
        this.openBlockTxnModalSuccess();
      }
    });
    return await modal.present();
  }

  async openBlockTxnModalSuccess() {
    const modal = await this.modalController.create({
      component: BlockTransferSuccessPopupComponent,
      cssClass: 'success-or-fail-modal',
      backdropDismiss: false,
      componentProps: {
        transactionToBlock: this.historyTransactionItem,
      },
    });
    return await modal.present();
  }

  formatDate(date: any) {
    return new Date(date);
  }

  checkifBuyerPostpaid() {
    this.authenticationService
      .getSubscription(this.dashboardService.getCurrentPhoneNumber())
      .subscribe((res: SubscriptionModel) => {
        this.isBuyerPostpaid = res && res.profil === PROFILE_TYPE_POSTPAID;
      });
  }

  terminer() {
    this.modalController.dismiss();
    if (this.isOpenedFromHistory) return;
    if (this.opXtras && this.opXtras.isLightMod) {
      this.router.navigate(['/dashboard-prepaid-light']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  getPassBoosters(pass: any) {
    return getActiveBoostersForSpecificPass(
      pass,
      BoosterService.lastBoostersList
    );
  }

  goToPage() {
    switch (this.purchaseType) {
      case OPERATION_TYPE_PASS_ALLO:
        this.appRouting.goToTransfertHubServicesPage('BUY');
        break;
      case OPERATION_TYPE_PASS_ILLIMIX:
        this.followAnalyticsServ.registerEventFollow(
          'Achat_pass_illimix_recap_renouvellement',
          'event',
          'clicked'
        );
        if (this.opXtras.recipientCodeFormule === CODE_KIRENE_Formule) {
          this.appRouting.goToBuyPassIllimixKirene();
        } else {
          this.appRouting.goToTransfertHubServicesPage('BUY');
        }
        break;
      case OPERATION_TYPE_PASS_INTERNET:
        this.followAnalyticsServ.registerEventFollow(
          'Achat_pass_internet_recap_renouvellement',
          'event',
          'clicked'
        );
        if (this.opXtras.recipientCodeFormule === CODE_KIRENE_Formule) {
          this.appRouting.goToBuyPassInternetKirene();
        } else {
          this.appRouting.goToTransfertHubServicesPage('BUY');
        }
        break;
      case OPERATION_TYPE_RECHARGE_CREDIT:
        this.followAnalyticsServ.registerEventFollow(
          'Achat_credit_recap_renouvellement',
          'event',
          'clicked'
        );
        if (this.opXtras.code === CODE_KIRENE_Formule) {
          this.appRouting.goBuyCredit();
        } else {
          this.appRouting.goToTransfertHubServicesPage('BUY');
        }
        break;
      case OPERATION_TYPE_MERCHANT_PAYMENT:
        this.followAnalyticsServ.registerEventFollow(
          'Paiement_marchand_recap_renouvellement',
          'event',
          'clicked'
        );
        this.appRouting.goToDashboard();
        break;
      case OPERATION_TRANSFER_OM:
        this.followAnalyticsServ.registerEventFollow(
          'OM_transfert_recap_renouvellement',
          'event',
          'clicked'
        );
        if (this.opXtras && this.opXtras.code === CODE_KIRENE_Formule) {
          this.navCtrl.pop();
        } else {
          this.appRouting.goToTransfertHubServicesPage('TRANSFER');
        }
        break;
      case OPERATION_TRANSFER_OM_WITH_CODE:
        this.followAnalyticsServ.registerEventFollow(
          'OM_transfert_recap_renouvellement',
          'event',
          'clicked'
        );
        if (this.opXtras.code === CODE_KIRENE_Formule) {
          this.navCtrl.pop();
        } else {
          this.appRouting.goToTransfertHubServicesPage('TRANSFER');
        }
        break;
      case OPERATION_WOYOFAL:
        this.followAnalyticsServ.registerEventFollow(
          'Achat_woyofal_recap_renouvellement',
          'event',
          'clicked'
        );
        this.navCtrl.navigateBack(BillsHubPage.ROUTE_PATH);
        break;
      case OPERATION_RAPIDO:
        this.followAnalyticsServ.registerEventFollow(
          'Recharge_rapido_recap_renouvellement',
          'event',
          'clicked'
        );
        this.navCtrl.navigateBack(RapidoOperationPage.ROUTE_PATH);
        break;
      case OPERATION_ENABLE_DALAL:
        this.followAnalyticsServ.registerEventFollow(
          'Dalal_activation_recap_renouvellement',
          'event',
          'clicked'
        );
        this.navCtrl.navigateBack(DalalTonesPage.ROUTE_PATH);
        break;
      case OPERATION_TYPE_PASS_ILLIFLEX:
        this.followAnalyticsServ.registerEventFollow(
          'Achat_pass_illiflex_recap_renouvellement',
          'event',
          'clicked'
        );
        this.appRouting.goToTransfertHubServicesPage('BUY');
        break;
      default:
        break;
    }
    this.modalController.dismiss();
  }
}
