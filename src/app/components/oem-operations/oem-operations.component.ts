import { Component, OnInit, Input } from '@angular/core';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { NavController, ModalController } from '@ionic/angular';
import { OperationOem } from 'src/app/models/operation.model';
import { WOYOFAL } from 'src/app/utils/bills.util';
import { IMAGES_DIR_PATH } from 'src/app/utils/constants';
import { WoyofalSelectionComponent } from '../counter/woyofal-selection/woyofal-selection.component';
import { OPERATION_WOYOFAL } from 'src/app/utils/operations.constants';
import { BillAmountPage } from 'src/app/pages/bill-amount/bill-amount.page';
import {
  OPERATION_TYPE_MERCHANT_PAYMENT,
  OPERATION_TYPE_PASS_ALLO,
} from 'src/shared';
import { MerchantPaymentCodeComponent } from 'src/shared/merchant-payment-code/merchant-payment-code.component';
import { PurchaseSetAmountPage } from 'src/app/purchase-set-amount/purchase-set-amount.page';
import { Observable } from 'rxjs';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';

@Component({
  selector: 'oem-operations',
  templateUrl: './oem-operations.component.html',
  styleUrls: ['./oem-operations.component.scss'],
})
export class OemOperationsComponent implements OnInit {
  @Input('operations') operations: OperationOem[] = [];
  @Input('showMore') showMore: boolean = true;
  OPERATION_TYPE_ALLO = OPERATION_TYPE_PASS_ALLO;
  showNewFeatureBadge$: Observable<Boolean>;
  constructor(
    private bsService: BottomSheetService,
    private navCtl: NavController,
    private dashboardService: DashboardService,
    private omService: OrangeMoneyService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getShowStatusNewFeatureAllo();
  }

  onOperation(op: OperationOem) {
    if (op.type === 'NAVIGATE') this.navCtl.navigateForward([op.action]);

    if (this.bsService[op.action] && 'openModal' === op.action) {
      if (op.type === OPERATION_WOYOFAL) {
        this.openCounterBS();
        return;
      }

      if (op.type === OPERATION_TYPE_MERCHANT_PAYMENT) {
        this.openMerchantBS();
        return;
      }
    }

    if (this.bsService[op.action]) {
      this.bsService[op.action](...op.params);
      return;
    }
  }

  openCounterBS() {
    this.bsService.opXtras.billData = {
      company: {
        name: 'Woyofal',
        code: WOYOFAL,
        logo: `${IMAGES_DIR_PATH}/woyofal@3x.png`,
      },
    };
    this.bsService
      .initBsModal(
        WoyofalSelectionComponent,
        OPERATION_WOYOFAL,
        BillAmountPage.ROUTE_PATH
      )
      .subscribe((_) => {});
    this.bsService.openModal(WoyofalSelectionComponent);
  }

  openMerchantBS() {
    this.omService.omAccountSession().subscribe(async (omSession: any) => {
      const omSessionValid = omSession
        ? omSession.msisdn !== 'error' &&
          omSession.hasApiKey &&
          !omSession.loginExpired
        : null;
      if (omSessionValid) {
        this.bsService
          .initBsModal(
            MerchantPaymentCodeComponent,
            OPERATION_TYPE_MERCHANT_PAYMENT,
            PurchaseSetAmountPage.ROUTE_PATH
          )
          .subscribe((_) => {});
        this.bsService.openModal(MerchantPaymentCodeComponent);
      } else {
        this.openPinpad();
      }
    });
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data && resp.data.success) {
        this.bsService.openModal(MerchantPaymentCodeComponent);
      }
    });
    return await modal.present();
  }
  getShowStatusNewFeatureAllo() {
    this.showNewFeatureBadge$ = this.dashboardService.getNewFeatureAlloBadgeStatus();
  }
}
