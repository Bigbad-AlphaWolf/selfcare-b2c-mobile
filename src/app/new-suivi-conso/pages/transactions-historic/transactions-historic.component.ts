import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { catchError, tap } from 'rxjs/operators';
import { CategoryPurchaseHistory } from 'src/app/models/category-purchase-history.model';
import { ModalSuccessModel } from 'src/app/models/modal-success-infos.model';
import { PurchaseModel } from 'src/app/models/purchase.model';
import { OperationSuccessFailModalPage } from 'src/app/operation-success-fail-modal/operation-success-fail-modal.page';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsEventType } from 'src/app/services/follow-analytics/follow-analytics-event-type.enum';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { PurchaseService } from 'src/app/services/purchase-service/purchase.service';
import {
  DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY,
  LIST_ICON_PURCHASE_HISTORIK_ITEMS,
  OPERATION_TRANSFER_OM,
  PAYMENT_MOD_OM,
  THREE_DAYS_DURATION_IN_MILLISECONDS,
} from 'src/shared';
import { displayDate } from '../../new-suivi-conso.utils';

@Component({
  selector: 'app-transactions-historic',
  templateUrl: './transactions-historic.component.html',
  styleUrls: ['./transactions-historic.component.scss'],
})
export class TransactionsHistoricComponent implements OnInit {
  loadingTransactions: boolean;
  transactionsHasError: boolean;
  transactionsEmpty: boolean;
  historicTransactions: any[];
  filteredHistoric: any[];
  categories: CategoryPurchaseHistory[];
  currentMsisdn = this.dashboardservice.getCurrentPhoneNumber();
  selectedFilter: { label: string; typeAchat: string } =
    DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY;
  constructor(
    private purchaseService: PurchaseService,
    private dashboardservice: DashboardService,
    private omService: OrangeMoneyService,
    private modalController: ModalController,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.getTransactionsHistoric();
  }

  getTransactionByType(filterType: { label: string; typeAchat: string }) {
    this.selectedFilter = filterType;
    if (
      this.selectedFilter.label ===
      DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY.label
    ) {
      this.filteredHistoric = this.historicTransactions;
    }
    this.filteredHistoric = this.historicTransactions.filter((item) =>
      item?.value
        .map((x) => x.typeAchat)
        .includes(this.selectedFilter.typeAchat)
    );
    this.filteredHistoric.forEach((element) => {
      element.value = element.value.filter(
        (x) => x.typeAchat === this.selectedFilter.typeAchat
      );
    });
    console.log(this.filteredHistoric);
  }

  getTransactionsHistoric(event?) {
    this.loadingTransactions = true;
    this.transactionsHasError = false;
    this.transactionsEmpty = false;
    this.selectedFilter = DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY;
    this.purchaseService
      .getCategoriesAndPurchaseHistory(this.currentMsisdn, 30)
      .pipe(
        tap(
          (res: {
            listPurchase: PurchaseModel[];
            categories: CategoryPurchaseHistory[];
          }) => {
            this.loadingTransactions = false;
            this.transactionsEmpty = !!res.listPurchase.length;
            this.categories = res.categories;
            this.historicTransactions = this.processTransactions(
              res.listPurchase
            );
            this.filteredHistoric = this.historicTransactions;
            event ? event.target.complete() : '';
          }
        ),
        catchError((err) => {
          this.loadingTransactions = false;
          event ? event.target.complete() : '';
          throw new Error(err);
        })
      )
      .subscribe();
  }

  processTransactions(historicArray: any[]) {
    const groups = historicArray.reduce((groupedHistoric, comItem) => {
      const date = comItem.operationDate.substring(0, 10);
      if (!groupedHistoric[date]) {
        groupedHistoric[date] = [];
      }
      groupedHistoric[date].push(comItem);
      return groupedHistoric;
    }, {});
    let response = [];
    for (let key in groups) {
      response.push({ key: key, value: groups[key] });
    }
    return response;
  }

  displayDate(date: string) {
    const formattedDate = date.split('-').reverse().join('/');
    return displayDate(formattedDate);
  }

  getFiltered() {}

  getTransactionIcon(typeAchat: string) {
    const icon = LIST_ICON_PURCHASE_HISTORIK_ITEMS[typeAchat];
    return icon ? icon : '/assets/images/ic-africa.svg';
  }

  async openTransactionModal(transaction) {
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
