import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY } from 'src/shared';
import { CategoryPurchaseHistory } from 'src/app/models/category-purchase-history.model';
import { PurchaseModel } from 'src/app/models/purchase.model';

@Component({
  selector: 'app-historique-achat',
  templateUrl: './historique-achat.component.html',
  styleUrls: ['./historique-achat.component.scss'],
})
export class HistoriqueAchatComponent implements OnInit {
  @Input() listTransactions: PurchaseModel[] = [];
  listDateFilter = [2, 3, 4, 5, 6, 7];
  @Input() listTypePurchaseFilter: CategoryPurchaseHistory[] = []
  @Input() dateFilterSelected = 2;
  typePurchaseFilterSelected: {label: string, typeAchat: string} = DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY;
  @Input() isLoading: boolean;
  @Input() hasError: boolean;
  @Output() getTransactionsByDay = new EventEmitter();
  @Output() getTransactionsByFilter = new EventEmitter();
  @Input() userProfil: string;
  constructor() {}

  ngOnInit() {
  }

  getTransactionByDay(day: number) {
      this.dateFilterSelected = day;
      this.getTransactionsByDay.emit(day);
  }

  getTransactionByType(filterType: {label: string, typeAchat: string}){
    this.typePurchaseFilterSelected = filterType;
    this.getTransactionsByFilter.emit(filterType);
  }

}
