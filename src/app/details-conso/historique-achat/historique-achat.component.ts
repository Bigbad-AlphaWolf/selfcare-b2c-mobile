import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { PurchaseModel } from 'src/shared';

@Component({
  selector: 'app-historique-achat',
  templateUrl: './historique-achat.component.html',
  styleUrls: ['./historique-achat.component.scss'],
})
export class HistoriqueAchatComponent implements OnInit {
  @Input() listTransactions: PurchaseModel[] = [];
  listDateFilter = [2, 3, 4, 5, 6, 7];
  listTypePurchaseFilter: {nom: string, value: string}[] = [{nom:"SOS", value:"SOS"}, {nom: "Transfert Bonus", value: "TRANSFERT_BONUS"},{nom:"Rechargement",value:"RECHARGEMENT"},{nom:"Dalal Tones",value:"DALALTONE"},{nom:"Pass Illimix",value:"ILLIMIX"},{nom:"Pass Internet", value:"INTERNET"},{nom:"Transfert Credit", value:"SEDDO"},{nom:"Tous", value:undefined}];
  dateFilterSelected: number;
  typePurchaseFilterSelected: {nom: string, value: string} = {nom: "Tous", value: undefined};
  @Input() isLoading: boolean;
  @Input() hasError: boolean;
  @Output() getTransactionsByDay = new EventEmitter();
  @Output() getTransactionsByFilter = new EventEmitter();
  constructor() {}

  ngOnInit() {
      this.dateFilterSelected = 2;
  }

  getTransactionByDay(day: number) {
      this.dateFilterSelected = day;
      this.getTransactionsByDay.emit(day);
  }

  getTransactionByType(filterType: {nom: string, value: string}){
    this.typePurchaseFilterSelected = filterType;
    this.getTransactionsByFilter.emit(filterType);
  }

}
