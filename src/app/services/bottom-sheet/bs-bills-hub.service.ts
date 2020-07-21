import { Injectable } from "@angular/core";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material";
import { BillCompany } from "src/app/models/bill-company.model";
import { Subject } from "rxjs";
import { OperationExtras } from "src/app/models/operation-extras.model";
import { NavController } from "@ionic/angular";
import { CounterSelectionComponent } from "src/app/components/counter/counter-selection/counter-selection.component";
import { OPERATION_WOYOFAL } from "src/app/utils/operations.util";
import { BillAmountPage } from "src/app/pages/bill-amount/bill-amount.page";
import { map } from "rxjs/operators";

@Injectable()
export class BsBillsHubService {
  opXtras: OperationExtras = {};
  companySelected: BillCompany;
  bsRef: Subject<MatBottomSheetRef> = new Subject();
  constructor(
    private matBottomSheet: MatBottomSheet,
    private navCtl: NavController
  ) {}
  initBs(compType: any) {
    return this.bsRef.pipe(
      map((ref) => {
        ref.afterDismissed().subscribe((result: any) => {
          let fromFavorites =
            result && result.TYPE_BS === "FAVORIES" && result.ACTION === "BACK";

          if (fromFavorites) this.openBSCounterSelection(compType);

          if (result && result.ACTION === "FORWARD") {
            this.opXtras.purchaseType = OPERATION_WOYOFAL;
            this.opXtras.billData.counter = result.counter;
            this.navCtl.navigateForward([BillAmountPage.ROUTE_PATH], {
              state: this.opXtras,
            });
          }
        });
      })
    );
  }
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
