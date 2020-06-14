import { Component, OnInit } from "@angular/core";
import { BILLS_COMPANIES_DATA } from "src/app/utils/bills.util";
import { BillCompany } from "src/app/models/bill-company.model";
import { BsBillsHubService } from "src/app/services/bottom-sheet/bs-bills-hub.service";
import { CounterSelectionComponent } from "src/app/components/counter/counter-selection/counter-selection.component";
import { OPERATION_WOYOFAL } from 'src/app/utils/constants';
import { BillAmountPage } from '../bill-amount/bill-amount.page';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: "app-bills-hub",
  templateUrl: "./bills-hub.page.html",
  styleUrls: ["./bills-hub.page.scss"],
})
export class BillsHubPage implements OnInit {
  public static ROUTE_PATH = "/bills-hub";
  companies: BillCompany[] = BILLS_COMPANIES_DATA;

  constructor(private bsBillsHubService: BsBillsHubService, private navCtl:NavController) {}

  ngOnInit() {
    this.bsBillsHubService.bsRef.subscribe((ref) => {
      ref.afterDismissed().subscribe((result: any) => {
        if (result && result.TYPE_BS === "FAVORIES" && result.ACTION === "BACK")
          this.bsBillsHubService.openBSCounterSelection(
            CounterSelectionComponent
          );

          if (result && result.ACTION === "FORWARD"){
            this.bsBillsHubService.opXtras.purchaseType = OPERATION_WOYOFAL;
            this.bsBillsHubService.opXtras.billData.counter =  result.counter ;
            this.navCtl.navigateForward([BillAmountPage.ROUTE_PATH],{state: this.bsBillsHubService.opXtras});
          }
      });
    });
  }

  onCompanySelected(billCompany: BillCompany) {
    // this.bsBillsHubService.companySelected = billCompany;
    this.bsBillsHubService.opXtras.billData = {company:billCompany};
    if(billCompany.code === 'WOYOFAL')//this will change
    this.bsBillsHubService.openBSCounterSelection(CounterSelectionComponent);
  }
}
