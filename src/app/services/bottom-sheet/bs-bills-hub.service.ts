import { Injectable } from "@angular/core";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material";
import { BillCompany } from "src/app/models/bill-company.model";
import {  Subject } from "rxjs";
import { OperationExtras } from 'src/app/models/operation-extras.model';

@Injectable()
export class BsBillsHubService {
  opXtras : OperationExtras = {};
  companySelected: BillCompany;
  bsRef: Subject<MatBottomSheetRef> = new Subject();
  constructor(private matBottomSheet: MatBottomSheet) {}

  openBSCounterSelection(compType?: any) {
    this.bsRef.next(
      this.matBottomSheet.open(compType, {
        data: { billCompany: this.companySelected },
        backdropClass: "oem-ion-bottomsheet",
      })
    );
  }

  openBSFavoriteCounters(compType: any) {
    this.bsRef.next(
      this.matBottomSheet.open(compType, {
        backdropClass: "oem-ion-bottomsheet",
      })
    );
  }
}
