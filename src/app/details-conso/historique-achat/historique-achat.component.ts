import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY,
  OPERATION_TRANSFER_OM,
  PAYMENT_MOD_OM,
  THREE_DAYS_DURATION_IN_MILLISECONDS,
} from 'src/shared';
import { CategoryPurchaseHistory } from 'src/app/models/category-purchase-history.model';
import { PurchaseModel } from 'src/app/models/purchase.model';
import { ModalSuccessModel } from 'src/app/models/modal-success-infos.model';
import { ModalController } from '@ionic/angular';
import { OperationSuccessFailModalPage } from 'src/app/operation-success-fail-modal/operation-success-fail-modal.page';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { FollowAnalyticsEventType } from 'src/app/services/follow-analytics/follow-analytics-event-type.enum';

@Component({
  selector: 'app-historique-achat',
  templateUrl: './historique-achat.component.html',
  styleUrls: ['./historique-achat.component.scss'],
})
export class HistoriqueAchatComponent implements OnInit {
  @Input() listTransactions: PurchaseModel[] = [];
  listDateFilter = [2, 3, 4, 5, 6, 7];
  @Input() listTypePurchaseFilter: CategoryPurchaseHistory[] = [];
  @Input() dateFilterSelected = 2;
  typePurchaseFilterSelected: { label: string; typeAchat: string } =
    DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY;
  @Input() isLoading: boolean;
  @Input() hasError: boolean;
  @Output() getTransactionsByDay = new EventEmitter();
  @Output() getTransactionsByFilter = new EventEmitter();
  @Input() userProfil: string;
  constructor(
    public modalController: ModalController,
    private omService: OrangeMoneyService,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {}

  getTransactionByDay(day: number) {
    this.dateFilterSelected = day;
    this.getTransactionsByDay.emit(day);
    this.typePurchaseFilterSelected =
      DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY;
  }

  getTransactionByType(filterType: { label: string; typeAchat: string }) {
    this.typePurchaseFilterSelected = filterType;
    this.getTransactionsByFilter.emit(filterType);
  }

  async openTransactionModal(transaction) {
    const date = new Date();
    // date difference in ms
    const dateDifference =
      new Date(transaction.currentDate).getTime() -
      new Date(transaction.operationDate).getTime();
    const isLessThan72h = dateDifference < THREE_DAYS_DURATION_IN_MILLISECONDS;
    if (!isLessThan72h || transaction.typeAchat !== 'TRANSFER') return;
    const omMsisdn = await this.omService.getOmMsisdn().toPromise();
    this.followAnalyticsService.registerEventFollow(
      'clic_transfer_from_history',
      FollowAnalyticsEventType.EVENT,
      { msisdn: omMsisdn, transaction }
    );
    if (!omMsisdn || omMsisdn === 'error') return;
    const params: ModalSuccessModel = {};
    params.paymentMod = PAYMENT_MOD_OM;
    params.recipientMsisdn = transaction.msisdnReceiver;
    params.msisdnBuyer = omMsisdn;
    params.purchaseType = OPERATION_TRANSFER_OM;
    params.historyTransactionItem = transaction;
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
