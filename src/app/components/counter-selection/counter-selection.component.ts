import { Component, OnInit, Inject } from '@angular/core';
import { Counter } from 'src/app/models/counter.model';
import { Observable, of } from 'rxjs';
import { WoyofalService } from 'src/app/services/woyofal/woyofal.service';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-counter-selection',
  templateUrl: './counter-selection.component.html',
  styleUrls: ['./counter-selection.component.scss'],
})
export class CounterSelectionComponent implements OnInit {
  isProcessing:boolean = false;
  counters$ : Observable<Counter[]> = of([{name:'Maison Nord-foire', counterNumber:'14 20 69 41 826'},{name:'Audi Q5', counterNumber:'14 20 69 41 826'}])
  constructor(private woyofal:WoyofalService,    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  private bottomSheetRef: MatBottomSheetRef<CounterSelectionComponent>,) { }

  ngOnInit() {
    // this.counters$ = this.woyofal.fetchRecentsCounters(); 
  }

  onRecentCounterSlected(){
    this.bottomSheetRef.dismiss();

  }

  onContinue(){

  }

  onMyFavorites(){

  }

  onInputChange(){

  }

}
