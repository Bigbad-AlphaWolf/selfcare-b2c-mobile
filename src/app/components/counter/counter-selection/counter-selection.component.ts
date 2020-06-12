import { Component, OnInit, Inject } from "@angular/core";
import { CounterOem } from "src/app/models/counter-oem.model";
import { Observable, of } from "rxjs";
import { CounterService } from "src/app/services/counter/counter.service";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material";
import { BsBillsHubService } from "src/app/services/bottom-sheet/bs-bills-hub.service";
import { FavoriteCountersComponent } from "../favorite-counters/favorite-counters.component";
import { NavController } from "@ionic/angular";
import { PurchaseSetAmountPage } from "src/app/purchase-set-amount/purchase-set-amount.page";
import { OperationExtras } from "src/app/models/operation-extras.model";
import { OPERATION_WOYOFAL } from "src/app/utils/constants";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { BillAmountPage } from "src/app/pages/bill-amount/bill-amount.page";
import { BillCompany } from "src/app/models/bill-company.model";

@Component({
  selector: "app-counter-selection",
  templateUrl: "./counter-selection.component.html",
  styleUrls: ["./counter-selection.component.scss"],
})
export class CounterSelectionComponent implements OnInit {
  isProcessing: boolean = false;
  inputCounterNumber: any = "";
  counters$: Observable<CounterOem[]> = of([
    { name: "Maison Nord-foire", counterNumber: "14206941826" },
    { name: "Audi Q5", counterNumber: "14206941826" },
  ]);
  constructor(
    private woyofal: CounterService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetBillsHub: BsBillsHubService,
    private bsRef: MatBottomSheetRef,
  ) {}

  ngOnInit() {
    // this.counters$ = this.woyofal.fetchRecentsCounters();
  }

  onRecentCounterSlected(counter: CounterOem) {
    this.bsRef.dismiss({
      TYPE_BS: "RECENTS",
      ACTION: "FORWARD",
      counter: counter,
    });
  }

  onContinue() {
    if (!this.counterNumberIsValid()) return;

    this.bsRef.dismiss({
      TYPE_BS: "INPUT",
      ACTION: "FORWARD",
      counter: { name: "Autre", counterNumber: this.inputCounterNumber },
    });
  }

  onMyFavorites() {
    this.bottomSheetBillsHub.openBSFavoriteCounters(FavoriteCountersComponent);
  }

  onInputChange(counterNumber) {
    this.inputCounterNumber = counterNumber;
  }

  counterNumberIsValid() {
    return true;
  }
}
