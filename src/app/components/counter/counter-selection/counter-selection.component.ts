import { Component, OnInit, Inject } from "@angular/core";
import { Counter } from "src/app/models/counter.model";
import { Observable, of } from "rxjs";
import { WoyofalService } from "src/app/services/woyofal/woyofal.service";
import { MAT_BOTTOM_SHEET_DATA } from "@angular/material";
import { BsBillsHubService } from "src/app/services/bottom-sheet/bs-bills-hub.service";
import { FavoriteCountersComponent } from "../favorite-counters/favorite-counters.component";

@Component({
  selector: "app-counter-selection",
  templateUrl: "./counter-selection.component.html",
  styleUrls: ["./counter-selection.component.scss"],
})
export class CounterSelectionComponent implements OnInit {
  isProcessing: boolean = false;
  counters$: Observable<Counter[]> = of([
    { name: "Maison Nord-foire", counterNumber: "14 20 69 41 826" },
    { name: "Audi Q5", counterNumber: "14 20 69 41 826" },
  ]);
  constructor(
    private woyofal: WoyofalService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetBillsHub: BsBillsHubService
  ) {}

  ngOnInit() {
    // this.counters$ = this.woyofal.fetchRecentsCounters();
  }

  onRecentCounterSlected() {}

  onContinue() {}

  onMyFavorites() {
    this.bottomSheetBillsHub.openBSFavoriteCounters(FavoriteCountersComponent);
    // this.openBSFavoriteCounters();
  }

  onInputChange(ev) {
    console.log(ev);
  }
}
