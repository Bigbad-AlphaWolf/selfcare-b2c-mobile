import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Counter } from 'src/app/models/counter.model';
import { MatBottomSheetRef, MatBottomSheet } from '@angular/material';
import { BillCompany } from 'src/app/models/bill-company.model';
import { BsBillsHubService } from 'src/app/services/bottom-sheet/bs-bills-hub.service';

@Component({
  selector: 'app-favorite-counters',
  templateUrl: './favorite-counters.component.html',
  styleUrls: ['./favorite-counters.component.scss'],
})
export class FavoriteCountersComponent implements OnInit {
  counters$ : Observable<Counter[]> = of([{name:'Maison Nord-foire', counterNumber:'14 20 69 41 826'},{name:'Audi Q5', counterNumber:'14 20 69 41 826'},{name:'Mn Nord-foire', counterNumber:'14 20 69 41 826'}])

  constructor(    private bottomSheetBillsHub: BsBillsHubService
,    private bottomSheetRef: MatBottomSheetRef<FavoriteCountersComponent>) { }

  ngOnInit() {
    
  }

  onFavoriteCounterSlected(){
    this.bottomSheetRef.dismiss({'TYPE_BS':'FAVORIES'});
  }

  navigateBack(){
    this.bottomSheetRef.dismiss({'TYPE_BS':'FAVORIES','ACTION':'BACK'})
  }

}
