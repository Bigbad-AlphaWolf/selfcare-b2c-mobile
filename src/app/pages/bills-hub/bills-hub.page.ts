import { Component, OnInit } from '@angular/core';
import {
  BILLS_COMPANIES_DATA,
  RAPIDO,
  WOYOFAL,
} from 'src/app/utils/bills.util';
import { BillCompany } from 'src/app/models/bill-company.model';
import { WoyofalSelectionComponent } from 'src/app/components/counter/woyofal-selection/woyofal-selection.component';
import { NavController, ToastController } from '@ionic/angular';
import { OPERATION_WOYOFAL } from 'src/app/utils/operations.constants';
import { BillAmountPage } from '../bill-amount/bill-amount.page';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { RapidoOperationPage } from '../rapido-operation/rapido-operation.page';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { Router } from '@angular/router';

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
    private navCtrl: NavController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {}

  async onCompanySelected(billCompany: BillCompany) {
    if (!this.isServciceActivated(billCompany)) {
      const service = OperationService.AllOffers.find(
        (service) => billCompany.idCode && service.code === billCompany.idCode
      );
      const toast = await this.toastController.create({
        header: 'Service indisponible',
        message: service.reasonDeactivation,
        duration: 3000,
        position: 'middle',
        color: 'medium',
      });
      toast.present();
      return;
    }

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

  isServciceActivated(company: BillCompany) {
    const service = OperationService.AllOffers.find(
      (service) => service.code === company.idCode
    );
    if (service) return service.activated;
    return true;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
