import {Component, OnInit, Input} from '@angular/core';
import {BottomSheetService} from 'src/app/services/bottom-sheet/bottom-sheet.service';
import {NavController, ModalController, ToastController} from '@ionic/angular';
import {WoyofalSelectionComponent} from '../counter/woyofal-selection/woyofal-selection.component';
import {OPERATION_RAPIDO, OPERATION_TYPE_PAY_BILL, OPERATION_WOYOFAL} from 'src/app/utils/operations.constants';
import {BillAmountPage} from 'src/app/pages/bill-amount/bill-amount.page';
import {OPERATION_TYPE_MERCHANT_PAYMENT} from 'src/shared';
import {MerchantPaymentCodeComponent} from 'src/shared/merchant-payment-code/merchant-payment-code.component';
import {PurchaseSetAmountPage} from 'src/app/purchase-set-amount/purchase-set-amount.page';
import {OrangeMoneyService} from 'src/app/services/orange-money-service/orange-money.service';
import {NewPinpadModalPage} from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import {OffreService} from 'src/app/models/offre-service.model';
import {FollowAnalyticsService} from 'src/app/services/follow-analytics/follow-analytics.service';
import {RapidoOperationPage} from 'src/app/pages/rapido-operation/rapido-operation.page';
import {SelectNumberForBillComponent} from '../select-number-for-bill/select-number-for-bill.component';

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

    if (op.code === OPERATION_TYPE_PAY_BILL) {
      this.openPayBillModal();
      return;
    }

    if (this.bsService[op.redirectionType]) {
      const params = ['NONE', op.code, op.redirectionPath];
      this.bsService[op.redirectionType](...params);
      return;
    }
  }

  async openPayBillModal() {
    const modal = await this.modalController.create({
      component: SelectNumberForBillComponent,
      cssClass: 'select-recipient-modal'
    });
    modal.onWillDismiss().then((response: any) => {
      if (response && response.data && response.data.recipientMsisdn) {
        const pageData = response.data;
        // this.appRouting.goSetTransferAmountPage(pageData);
      }
    });
    return await modal.present();
  }

  openCounterBS() {
    this.bsService.initBsModal(WoyofalSelectionComponent, OPERATION_WOYOFAL, BillAmountPage.ROUTE_PATH).subscribe(_ => {});
    this.bsService.openModal(WoyofalSelectionComponent);
    return;
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
