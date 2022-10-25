import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CategoryPurchaseHistory } from 'src/app/models/category-purchase-history.model';
import { PurchaseModel } from 'src/app/models/purchase.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { PurchaseService } from 'src/app/services/purchase-service/purchase.service';
import { DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY, OPERATION_CANCEL_TRX_MLITE } from 'src/shared';
import { YesNoModalComponent } from 'src/shared/yes-no-modal/yes-no-modal.component';
import { displayDate } from '../../new-suivi-conso.utils';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';

@Component({
  selector: 'app-transactions-historic',
  templateUrl: './transactions-historic.component.html',
  styleUrls: ['./transactions-historic.component.scss'],
})
export class TransactionsHistoricComponent implements OnInit {
  loadingTransactions: boolean;
  transactionsHasError: boolean;
  transactionsEmpty: boolean;
  historicTransactions: { key: string; value: PurchaseModel[] }[];
  filteredHistoric: { key: string; value: PurchaseModel[] }[] = [];
  categories: CategoryPurchaseHistory[];
  currentMsisdn = this.dashboardservice.getCurrentPhoneNumber();
  selectedFilter: { label: string; typeAchat: string } = DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY;
  dateFilters = [
    { label: '2 jours', value: 2 },
    { label: '3 jours', value: 3 },
    { label: '5 jours', value: 5 },
    { label: '7 jours', value: 7 },
  ];
  selectedDateFilter = this.dateFilters[0];
  listAnnulationTrx: PurchaseModel[] = [];
  isFetchingListAnnulationTrx: boolean;
  constructor(
    private purchaseService: PurchaseService,
    private dashboardservice: DashboardService,
    private omService: OrangeMoneyService,
    private modalController: ModalController,
    private oemLoggingService: OemLoggingService
  ) {}

  ngOnInit() {
    this.getTransactionsHistoric();
    this.fetchAnnulationTrx();
  }

  filterByDate(dateFilter) {
    this.selectedDateFilter = dateFilter;
    this.oemLoggingService.registerEvent('conso_transactions_filter', [{ dataName: 'date', dataValue: dateFilter?.label }]);
    this.getTransactionsHistoric();
  }

  getTransactionByType(filterType: { label: string; typeAchat: string }) {
    this.filteredHistoric = JSON.parse(JSON.stringify(this.historicTransactions));
    this.selectedFilter = filterType;
    this.oemLoggingService.registerEvent('conso_transactions_filter', [{ dataName: 'date', dataValue: filterType?.label }]);
    if (this.selectedFilter.label === DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY.label) {
      return;
    }
    this.filteredHistoric = this.filteredHistoric.filter(item => {
      return item?.value.map(x => x.typeAchat).includes(this.selectedFilter.typeAchat);
    });
    this.filteredHistoric.forEach(element => {
      element.value = element.value.filter(x => x.typeAchat === this.selectedFilter.typeAchat);
    });
  }

  getTransactionsHistoric(event?) {
    this.loadingTransactions = true;
    this.transactionsHasError = false;
    this.transactionsEmpty = false;
    this.selectedFilter = DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY;
    this.purchaseService
      .getCategoriesAndPurchaseHistory(this.currentMsisdn, this.selectedDateFilter.value)
      .pipe(
        tap((res: { listPurchase: PurchaseModel[]; categories: CategoryPurchaseHistory[] }) => {
          this.loadingTransactions = false;
          this.transactionsEmpty = !!res.listPurchase.length;
          this.categories = res.categories;

          this.historicTransactions = this.processTransactions(res.listPurchase);
          this.filteredHistoric = this.historicTransactions.slice(0);
          event ? event.target.complete() : '';
        }),
        catchError(err => {
          this.loadingTransactions = false;
          event ? event.target.complete() : '';
          return throwError(err);
        })
      )
      .subscribe();
  }

  fetchAnnulationTrx() {
    this.omService.getAnnulationTrxMarchandLite().subscribe((res: any) => {
      this.listAnnulationTrx = this.omService.mapToHistorikAchat(res?.content?.data?.content);
    });
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

  async openConfirmModal(transaction: PurchaseModel) {
    const modalCtrl = await this.modalController.create({
      component: YesNoModalComponent,
      componentProps: {
        typeModal: OPERATION_CANCEL_TRX_MLITE,
        transaction,
      },
      cssClass: 'select-recipient-modal',
    });

    modalCtrl.onDidDismiss().then((res: any) => {
      res = res.data;
      if (res?.continue) {
        this.isFetchingListAnnulationTrx = true;
        this.omService.getAnnulationTrxMarchandLite().subscribe((res: any) => {
          this.isFetchingListAnnulationTrx = false;
          this.listAnnulationTrx = this.omService.mapToHistorikAchat(res?.content?.data?.content);
        });
      }
    });
    return await modalCtrl.present();
  }
}
