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
      tap((res: PurchaseModel[]) => {
			res = res.filter((elt) => {
			 return	elt.operationType === 'DEBIT'
			})
      this.isProcessing = false;
      this.hasError = false;
			res = res.filter((elt) => {
				return elt?.operationType === 'DEBIT'
			});
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

	close() {
		this.mdCtrl.dismiss();
	}

}
