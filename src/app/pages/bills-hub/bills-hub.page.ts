import { Component, OnInit } from "@angular/core";
import { BILLS_COMPANIES_DATA } from "src/app/utils/bills.util";
import { BillCompany } from "src/app/models/bill-company.model";
import { BsBillsHubService } from "src/app/services/bottom-sheet/bs-bills-hub.service";
import { CounterSelectionComponent } from "src/app/components/counter/counter-selection/counter-selection.component";
import { NavController } from '@ionic/angular';

@Component({
  selector: "app-bills-hub",
  templateUrl: "./bills-hub.page.html",
  styleUrls: ["./bills-hub.page.scss"],
})
export class BillsHubPage implements OnInit {
  public static ROUTE_PATH = '/bills-hub';
  companies: BillCompany[] = BILLS_COMPANIES_DATA;

  constructor(private bsBillsHubService: BsBillsHubService, private navCtl:NavController) {}

  ngOnInit() {
    this.bsBillsHubService.initBs(CounterSelectionComponent).subscribe(_=>{});
  }

  onCompanySelected(billCompany: BillCompany) {
    this.bsBillsHubService.opXtras.billData = {company:billCompany};
    if(billCompany.code === 'WOYOFAL')//this will change
    this.bsBillsHubService.openBSCounterSelection(CounterSelectionComponent);
  }
}
