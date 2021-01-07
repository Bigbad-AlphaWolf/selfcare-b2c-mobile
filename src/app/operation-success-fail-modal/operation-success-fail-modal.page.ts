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
  getActiveBoostersForSpecificPass,
} from 'src/shared';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { OperationExtras } from '../models/operation-extras.model';
import {
  OPERATION_RAPIDO,
  OPERATION_WOYOFAL,
} from '../utils/operations.constants';
import { BillsHubPage } from '../pages/bills-hub/bills-hub.page';
import { DalalTonesPage } from '../dalal-tones/dalal-tones.page';
import { RapidoOperationPage } from '../pages/rapido-operation/rapido-operation.page';
import { BoosterService } from '../services/booster.service';
import { GiftType } from '../models/enums/gift-type.enum';

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
  dateAchat = this.dashboardService.getCurrentDate();
  btnText: string;
  coupon;
  hasCoupon: boolean;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    public modalController: ModalController,
    private appRouting: ApplicationRoutingService,
    private navCtrl: NavController,
    private boosterService: BoosterService
  ) {}

  ngOnInit() {
    this.getCoupon();
  }

  getCoupon() {
    if (
      !BoosterService.lastBoostersList ||
      !BoosterService.lastBoostersList.length ||
      !this.passBought
    )
      return;
    const passPPI = this.passBought.passPromo
      ? this.passBought.passPromo.price_plan_index
      : this.passBought.price_plan_index;
    const appliedBooster = BoosterService.lastBoostersList.find(
      (booster) =>
        booster.gift.type === GiftType.COUPON &&
        booster.pricePlanIndexes.includes(passPPI.toString())
    );
    if (!appliedBooster) return;
    this.hasCoupon = true;
  }

  terminer() {
    this.modalController.dismiss();
    this.router.navigate(['/dashboard']);
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
        if (this.opXtras.code === CODE_KIRENE_Formule) {
          this.appRouting.goToBuyPassIllimixKirene();
        } else {
          this.appRouting.goToTransfertHubServicesPage('BUY');
        }
        break;
      case OPERATION_TYPE_PASS_INTERNET:
        if (this.opXtras.code === CODE_KIRENE_Formule) {
          this.appRouting.goToBuyPassInternetKirene();
        } else {
          this.appRouting.goToTransfertHubServicesPage('BUY');
        }
        break;
      case OPERATION_TYPE_RECHARGE_CREDIT:
        if (this.opXtras.code === CODE_KIRENE_Formule) {
          this.appRouting.goBuyCredit();
        } else {
          this.appRouting.goToTransfertHubServicesPage('BUY');
        }
        break;
      case OPERATION_TYPE_MERCHANT_PAYMENT:
        this.appRouting.goToDashboard();
        break;
      case OPERATION_TRANSFER_OM:
        if (this.opXtras.code === CODE_KIRENE_Formule) {
          this.navCtrl.pop();
        } else {
          this.appRouting.goToTransfertHubServicesPage('TRANSFER');
        }
        break;
      case OPERATION_TRANSFER_OM_WITH_CODE:
        if (this.opXtras.code === CODE_KIRENE_Formule) {
          this.navCtrl.pop();
        } else {
          this.appRouting.goToTransfertHubServicesPage('TRANSFER');
        }
        break;
        break;
      case OPERATION_WOYOFAL:
        this.navCtrl.navigateBack(BillsHubPage.ROUTE_PATH);
        break;
      case OPERATION_RAPIDO:
        this.navCtrl.navigateBack(RapidoOperationPage.ROUTE_PATH);
        break;
      case OPERATION_ENABLE_DALAL:
        this.navCtrl.navigateBack(DalalTonesPage.ROUTE_PATH);
        break;
      case OPERATION_TYPE_PASS_ILLIFLEX:
        this.router.navigate(['/select-illiflex-type']);
        break;
      default:
        break;
    }
    this.modalController.dismiss();
  }
}
