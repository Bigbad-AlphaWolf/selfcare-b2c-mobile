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
} from 'src/shared';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { OperationExtras } from '../models/operation-extras.model';
import {
  OPERATION_RAPIDO,
  OPERATION_WOYOFAL,
} from '../utils/operations.constants';
import { BillsHubPage } from '../pages/bills-hub/bills-hub.page';
import { RapidOperationPage } from '../pages/rapid-operation/rapid-operation.page';
import { DalalTonesPage } from '../dalal-tones/dalal-tones.page';

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

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    public modalController: ModalController,
    private appRouting: ApplicationRoutingService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  terminer() {
    this.modalController.dismiss();
    this.router.navigate(['/dashboard']);
  }

  goToPage() {
    switch (this.purchaseType) {
      case this.OPERATION_ILLIMIX_TYPE:
      case this.OPERATION_ALLO_TYPE:
      case this.OPERATION_INTERNET_TYPE:
      case this.OPERATION_TYPE_RECHARGE:
        this.appRouting.goToTransfertHubServicesPage('BUY');
        break;
      case this.OPERATION_TYPE_MERCHANT_PAYMENT:
        this.appRouting.goToDashboard();
        break;
      case this.OPERATION_TRANSFER_OM:
      case this.OPERATION_TRANSFER_OM_WITH_CODE:
        this.appRouting.goToTransfertHubServicesPage('TRANSFER');
        break;
      case OPERATION_WOYOFAL:
        this.navCtrl.navigateBack(BillsHubPage.ROUTE_PATH);
        break;
      case OPERATION_RAPIDO:
        this.navCtrl.navigateBack(RapidOperationPage.ROUTE_PATH);
        break;
      case OPERATION_ENABLE_DALAL:
        this.navCtrl.navigateBack(DalalTonesPage.ROUTE_PATH);
        break;
      default:
        break;
    }
    this.modalController.dismiss();
  }
}
