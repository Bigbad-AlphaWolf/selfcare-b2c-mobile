import { Component, OnInit } from "@angular/core";
import { BILLS_COMPANIES_DATA } from "src/app/utils/bills.util";
import { BillCompany } from "src/app/models/bill-company.model";
import { ModalController } from "@ionic/angular";
import { CounterSelectionComponent } from "src/app/components/counter-selection/counter-selection.component";
import { MatBottomSheet } from "@angular/material";

@Component({
  selector: "app-bills-hub",
  templateUrl: "./bills-hub.page.html",
  styleUrls: ["./bills-hub.page.scss"],
})
export class BillsHubPage implements OnInit {
  public static ROUTE_PATH = "/bills-hub";
  companies: BillCompany[] = [];
  companySelected: BillCompany;

  constructor(
    private modalCtl: ModalController,
    private matBottomSheet: MatBottomSheet
  ) {}

  ngOnInit() {
    this.companies = BILLS_COMPANIES_DATA;
  }

  onCompanySelected(billCompany: BillCompany) {
    this.openBSCounterSelection();
  }

  openBSCounterSelection() {
    this.matBottomSheet
      .open(CounterSelectionComponent, {
        data: { billCompany: this.companySelected },
        backdropClass: "oem-ion-bottomsheet",
      })
      .afterDismissed()
      .subscribe((opXtra: any) => {
        // if(!opXtra || !opXtra.recipientMsisdn) return;
        // opXtra = { purchaseType:OPERATION_TYPE_RECHARGE_CREDIT, ...opXtra}
        // this.router.navigate([CreditPassAmountPage.PATH], {state:opXtra});
      });
  }
}
