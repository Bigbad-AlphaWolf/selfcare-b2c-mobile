import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalSuccessModel } from 'src/app/models/modal-success-infos.model';
import { OperationSuccessFailModalPage } from 'src/app/operation-success-fail-modal/operation-success-fail-modal.page';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';
import { LIST_ICON_PURCHASE_HISTORIK_ITEMS, OPERATION_TRANSFER_OM, PAYMENT_MOD_OM, FIVE_DAYS_DURATION_IN_MILLISECONDS } from '..';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss'],
})
export class TransactionItemComponent implements OnInit {
  @Input() transaction: any;
  @Input() typeTransaction: string;
  @Output() onClick = new EventEmitter();
  currentMsisdn = this.dashboardService.getCurrentPhoneNumber();
  constructor(
    private omService: OrangeMoneyService,
    private modalController: ModalController,
    private oemLoggingService: OemLoggingService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {}

  async openTransactionModal() {
    // date difference in ms
    this.onClick.emit(this.transaction);
    const dateDifference = new Date(this.transaction.currentDate).getTime() - new Date(this.transaction.operationDate).getTime();
    const isLessThan72h = dateDifference < FIVE_DAYS_DURATION_IN_MILLISECONDS;
    if (isLessThan72h && (this.transaction.typeAchat === 'TRANSFER' || this.transaction.typeAchat === 'TRANSFERT_ARGENT') && this.transaction.operationType === 'DEBIT') {
      const omMsisdn = await this.omService.getOmMsisdn().toPromise();
      this.oemLoggingService.registerEvent('clic_transfer_from_history', convertObjectToLoggingPayload({ msisdn: omMsisdn, transaction: this.transaction }));
      if (!omMsisdn || omMsisdn === 'error') return;
      const params: ModalSuccessModel = {};
      params.paymentMod = PAYMENT_MOD_OM;
      params.recipientMsisdn = this.transaction.msisdnReceiver;
      params.msisdnBuyer = omMsisdn;
      params.purchaseType = OPERATION_TRANSFER_OM;
      params.historyTransactionItem = this.transaction;
      params.success = true;
      params.isOpenedFromHistory = true;
      const modal = await this.modalController.create({
        component: OperationSuccessFailModalPage,
        cssClass: 'success-or-fail-modal',
        componentProps: params,
        backdropDismiss: true,
      });
      modal.onDidDismiss().then(() => {});
      return await modal.present();
    }
  }

  getTransactionIcon() {
    const typeAchat = this.transaction.typeAchat;
    const icon = LIST_ICON_PURCHASE_HISTORIK_ITEMS[typeAchat];
    return icon ? icon : '/assets/images/ic-africa.svg';
  }
}
