import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OPERATION_TRANSACTION_STATUS } from 'src/shared';
import { TransactionFinalityModalComponent } from 'src/shared/transaction-finality-modal/transaction-finality-modal.component';
import { ModalSuccessModel } from '../models/modal-success-infos.model';
import { OPERATION_TYPE_CARD_TO_WALLET } from '../utils/operations.constants';
import { DashboardService } from './dashboard-service/dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private modalController: ModalController,
    private dashboardService: DashboardService
  ) {}

  handleNotification(notif) {
    switch (notif?.operationType) {
      case OPERATION_TYPE_CARD_TO_WALLET:
        this.openSuccessFailModal(notif);
    }
  }

  async openSuccessFailModal(notif) {
    let params = {};
    params['msisdnBuyer'] = this.dashboardService.getMainPhoneNumber();
    params['amount'] = notif?.amount;
    params['recipientMsisdn'] = notif?.beneficiary;
    params['purchaseType'] = notif?.operationType;
    params['buyForMe'] =
      notif?.beneficiary === this.dashboardService.getMainPhoneNumber();
    params['operationStatus'] = OPERATION_TRANSACTION_STATUS.SUCCESS;
    params['dateAchat'] = notif?.date;
    const modal = await this.modalController.create({
      component: TransactionFinalityModalComponent,
      cssClass: 'success-or-fail-modal',
      componentProps: params,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((res) => {});
    return await modal.present();
  }
}
