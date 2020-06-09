import { Component, OnInit } from '@angular/core';
import { Counter } from 'src/app/models/counter.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-counter-selection',
  templateUrl: './counter-selection.component.html',
  styleUrls: ['./counter-selection.component.scss'],
})
export class CounterSelectionComponent implements OnInit {
  isProcessing:boolean = false;
  counters$ : Observable<Counter[]> = of([{name:'Maison Nord-foire', counterNumber:'14 20 69 41 826'},{name:'Audi Q5', counterNumber:'14 20 69 41 826'},{name:'Maison Nord-foire', counterNumber:'14 20 69 41 826'}])
  constructor() { }

  ngOnInit() {}

  onRecentCounterSlected(){

  }

  onContinue(){

  }

  onMyFavorites(){

  }

  onInputChange(){

  }

}
