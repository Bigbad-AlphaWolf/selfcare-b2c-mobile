import { Component, OnInit } from "@angular/core";
import { BILLS_COMPANIES_DATA, WOYOFAL } from "src/app/utils/bills.util";
import { BillCompany } from "src/app/models/bill-company.model";
import { CounterSelectionComponent } from "src/app/components/counter/counter-selection/counter-selection.component";
import { NavController } from "@ionic/angular";
import { OPERATION_WOYOFAL } from "src/app/utils/operations.util";
import { BillAmountPage } from "../bill-amount/bill-amount.page";
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';

@Component({
  selector: "app-bills-hub",
  templateUrl: "./bills-hub.page.html",
  styleUrls: ["./bills-hub.page.scss"],
})
export class BillsHubPage implements OnInit {
  public static ROUTE_PATH = "/bills-hub";
  companies: BillCompany[] = BILLS_COMPANIES_DATA;

  constructor(private bsService: BottomSheetService) {}

  ngOnInit() {
    this.bsService
      .initBsModal(
        CounterSelectionComponent,
        OPERATION_WOYOFAL,
        BillAmountPage.ROUTE_PATH
        
      )
      .subscribe((_) => {});
  }

  onCompanySelected(billCompany: BillCompany) {
    this.bsService.opXtras.billData = { company: billCompany };
    if (billCompany.code === WOYOFAL)
      //this will change
      this.bsService.openModal(CounterSelectionComponent);
  }
}
