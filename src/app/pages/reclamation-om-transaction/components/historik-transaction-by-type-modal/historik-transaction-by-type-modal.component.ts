import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { PurchaseModel } from 'src/app/models/purchase.model';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { PurchaseService } from 'src/app/services/purchase-service/purchase.service';
@Component({
  selector: 'app-historik-transaction-by-type-modal',
  templateUrl: './historik-transaction-by-type-modal.component.html',
  styleUrls: ['./historik-transaction-by-type-modal.component.scss'],
})
export class HistorikTransactionByTypeModalComponent implements OnInit {
  @Input() typeTransaction: string;
  isProcessing: boolean;
  listTransactionsFiltered: PurchaseModel[] = [];
  dateFilterItems = [
    { title: '2 derniers jours', value: 2 },
    { title: '3 derniers jours', value: 3 },
    { title: '5 derniers jours', value: 5 },
    { title: '7 derniers jours', value: 7 }
  ];
  currentPhoneNumber: string;
  errorMsg = "Une erreur est survenue. Cliquer pour réessayer";
  hasError:boolean;
  constructor(private mdCtrl: ModalController, private purchServ: PurchaseService, private dashbServ: DashboardService) { }

  ngOnInit() {
    this.currentPhoneNumber = this.dashbServ.getCurrentPhoneNumber();
    this.fetchTransactions();
  }

  fetchTransactions() {
    this.isProcessing = true;
    this.hasError = false;
    this.purchServ.getAllTransactionByDay(this.currentPhoneNumber,7,'TRANSFER').pipe(
      switchMap((resp1: PurchaseModel[]) => {
        return this.purchServ.getAllTransactionByDay(this.currentPhoneNumber, 7, 'TRANSFERT_ARGENT_CODE').pipe(
          map((resp2: any) => {
            return resp1.concat(resp2)
          })
        )
      }),
      tap((res: PurchaseModel[]) => {
      this.isProcessing = false;
      this.hasError = false;
      this.listTransactionsFiltered = res;
    }),catchError((err: any) => {
      this.isProcessing = false;
      this.hasError = true;
      return of(err);
    })).subscribe()
  }

  closeModal(purchase: PurchaseModel){
    this.mdCtrl.dismiss({
      'purchaseInfos': purchase
    })
  }

}
