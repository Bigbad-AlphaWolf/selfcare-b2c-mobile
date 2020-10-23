import { Component, OnInit } from '@angular/core';
import {
  BILLS_COMPANIES_DATA,
  RAPIDO,
  WOYOFAL,
} from 'src/app/utils/bills.util';
import { BillCompany } from 'src/app/models/bill-company.model';
import { WoyofalSelectionComponent } from 'src/app/components/counter/woyofal-selection/woyofal-selection.component';
import { NavController } from '@ionic/angular';
import { OPERATION_WOYOFAL } from 'src/app/utils/operations.constants';
import { BillAmountPage } from '../bill-amount/bill-amount.page';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { RapidoOperationPage } from '../rapido-operation/rapido-operation.page';

@Component({
  selector: 'app-bills-hub',
  templateUrl: './bills-hub.page.html',
  styleUrls: ['./bills-hub.page.scss'],
})
export class BillsHubPage implements OnInit {
  public static ROUTE_PATH = '/bills-hub';
  companies: BillCompany[] = BILLS_COMPANIES_DATA;

  constructor(
    private bsService: BottomSheetService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  onCompanySelected(billCompany: BillCompany) {
    this.bsService.opXtras.billData = { company: billCompany };
    if (billCompany.code === WOYOFAL) {
      this.bsService
        .initBsModal(
          WoyofalSelectionComponent,
          OPERATION_WOYOFAL,
          BillAmountPage.ROUTE_PATH
        )
        .subscribe((_) => {});
      this.bsService.openModal(WoyofalSelectionComponent);
      return;
    }

    if (billCompany.code === RAPIDO) {
      console.log(this.bsService.opXtras.billData);

      this.navCtrl.navigateForward(RapidoOperationPage.ROUTE_PATH);
      return;
    }
    //this will change
  }
}
