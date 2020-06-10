import { Component, OnInit } from "@angular/core";
import { BILLS_COMPANIES_DATA } from "src/app/utils/bills.util";
import { BillCompany } from "src/app/models/bill-company.model";
import { BsBillsHubService } from "src/app/services/bottom-sheet/bs-bills-hub.service";
import { CounterSelectionComponent } from "src/app/components/counter/counter-selection/counter-selection.component";

@Component({
  selector: "app-bills-hub",
  templateUrl: "./bills-hub.page.html",
  styleUrls: ["./bills-hub.page.scss"],
})
export class BillsHubPage implements OnInit {
  public static ROUTE_PATH = "/bills-hub";
  companies: BillCompany[] = [];
  companySelected: BillCompany;

  constructor(private bottomSheetBillsHub: BsBillsHubService) {}

  ngOnInit() {
    this.companies = BILLS_COMPANIES_DATA;

    this.bottomSheetBillsHub.bsRef.subscribe((ref) => {
      ref.afterDismissed().subscribe((result: any) => {
        if (result && result.TYPE_BS === "FAVORIES" && result.ACTION === "BACK")
          this.bottomSheetBillsHub.openBSCounterSelection(
            CounterSelectionComponent
          );
      });
    });
  }

  onCompanySelected(billCompany: BillCompany) {
    this.bottomSheetBillsHub.companySelected = billCompany;
    this.bottomSheetBillsHub.openBSCounterSelection(CounterSelectionComponent);
  }
}
