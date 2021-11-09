import {Component, OnInit, Input} from '@angular/core';
import {BottomSheetService} from 'src/app/services/bottom-sheet/bottom-sheet.service';
import {NavController, ModalController, ToastController} from '@ionic/angular';
import {WOYOFAL} from 'src/app/utils/bills.util';
import {IMAGES_DIR_PATH} from 'src/app/utils/constants';
import {WoyofalSelectionComponent} from '../counter/woyofal-selection/woyofal-selection.component';
import {OPERATION_RAPIDO, OPERATION_WOYOFAL} from 'src/app/utils/operations.constants';
import {BillAmountPage} from 'src/app/pages/bill-amount/bill-amount.page';
import {OPERATION_TYPE_MERCHANT_PAYMENT} from 'src/shared';
import {MerchantPaymentCodeComponent} from 'src/shared/merchant-payment-code/merchant-payment-code.component';
import {PurchaseSetAmountPage} from 'src/app/purchase-set-amount/purchase-set-amount.page';
import {OrangeMoneyService} from 'src/app/services/orange-money-service/orange-money.service';
import {NewPinpadModalPage} from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import {OffreService} from 'src/app/models/offre-service.model';
import {FollowAnalyticsService} from 'src/app/services/follow-analytics/follow-analytics.service';
import {RapidoOperationPage} from 'src/app/pages/rapido-operation/rapido-operation.page';

@Component({
  selector: 'oem-operations',
  templateUrl: './oem-operations.component.html',
  styleUrls: ['./oem-operations.component.scss']
})
export class OemOperationsComponent implements OnInit {
  @Input('operations') operations: OffreService[] = [];
  @Input('showMore') showMore: boolean = true;
  constructor(
    private bsService: BottomSheetService,
    private navCtl: NavController,
    private omService: OrangeMoneyService,
    private modalController: ModalController,
    private toastController: ToastController,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {}

  async onOperation(op: OffreService) {
    this.followAnalyticsService.registerEventFollow('services_' + op.code.toLowerCase() + '_clic', 'event', 'clicked');
    if (!op.activated) {
      const toast = await this.toastController.create({
        header: 'Service indisponible',
        message: op.reasonDeactivation,
        duration: 3000,
        position: 'middle',
        color: 'medium'
      });
      toast.present();
      return;
    }
    console.log(op, 'opp');

    this.bsService.opXtras.billData = {company: op};
    if (op.redirectionType === 'NAVIGATE') this.navCtl.navigateForward([op.redirectionPath]);

    if (op.code === OPERATION_WOYOFAL) {
      this.openCounterBS();
      return;
    }

    if (op.code === OPERATION_TYPE_MERCHANT_PAYMENT) {
      this.openMerchantBS();
      return;
    }

    if (op.code === OPERATION_RAPIDO) {
      this.navCtl.navigateForward(RapidoOperationPage.ROUTE_PATH);
      return;
    }

    if (this.bsService[op.redirectionType]) {
      const params = ['NONE', op.code, op.redirectionPath];
      this.bsService[op.redirectionType](...params);
      return;
    }
  }

  openCounterBS() {
    this.bsService.opXtras.billData = {
      company: {
        name: 'Woyofal',
        code: WOYOFAL,
        logo: `${IMAGES_DIR_PATH}/woyofal@3x.png`
      }
    };
    this.bsService.initBsModal(WoyofalSelectionComponent, OPERATION_WOYOFAL, BillAmountPage.ROUTE_PATH).subscribe(_ => {});
    this.bsService.openModal(WoyofalSelectionComponent);
  }

  openMerchantBS() {
    this.omService.omAccountSession().subscribe(async (omSession: any) => {
      const omSessionValid = omSession ? omSession.msisdn !== 'error' && omSession.hasApiKey && !omSession.loginExpired : null;
      if (omSessionValid) {
        this.bsService
          .initBsModal(MerchantPaymentCodeComponent, OPERATION_TYPE_MERCHANT_PAYMENT, PurchaseSetAmountPage.ROUTE_PATH)
          .subscribe(_ => {});
        this.bsService.openModal(MerchantPaymentCodeComponent);
      } else {
        this.openPinpad();
      }
    });
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal'
    });
    modal.onDidDismiss().then(resp => {
      if (resp && resp.data && resp.data.success) {
        this.bsService.openModal(MerchantPaymentCodeComponent);
      }
    });
    return await modal.present();
  }

  isServiceHidden(action: OffreService) {
    return !action.activated && (!action.reasonDeactivation || action.reasonDeactivation === '');
  }
}
