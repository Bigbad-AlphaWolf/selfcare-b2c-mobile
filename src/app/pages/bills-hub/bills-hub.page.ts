import { Component, OnInit } from '@angular/core';
import {
  BILLS_COMPANIES_DATA,
  RAPIDO,
  WOYOFAL,
} from 'src/app/utils/bills.util';
import { WoyofalSelectionComponent } from 'src/app/components/counter/woyofal-selection/woyofal-selection.component';
import { NavController, ToastController } from '@ionic/angular';
import { OPERATION_WOYOFAL } from 'src/app/utils/operations.constants';
import { BillAmountPage } from '../bill-amount/bill-amount.page';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { RapidoOperationPage } from '../rapido-operation/rapido-operation.page';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { Router } from '@angular/router';
import { OffreService } from 'src/app/models/offre-service.model';
import { HUB_ACTIONS } from 'src/shared';

@Component({
  selector: 'app-bills-hub',
  templateUrl: './bills-hub.page.html',
  styleUrls: ['./bills-hub.page.scss'],
})
export class BillsHubPage implements OnInit {
  public static ROUTE_PATH = '/bills-hub';
  companies: OffreService[];
  onCompaniesError: boolean;
  loadingCompanies: boolean;

  constructor(
    private bsService: BottomSheetService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private router: Router,
    private operationService: OperationService
  ) {}

  ngOnInit() {
    this.getCompanies();
  }

  getCompanies() {
    this.onCompaniesError = false;
    this.loadingCompanies = true;
    this.operationService.getServicesByFormule(HUB_ACTIONS.FACTURES).subscribe(
      (companies: OffreService[]) => {
        this.companies = companies;
        this.loadingCompanies = false;
      },
      (err) => {
        this.onCompaniesError = true;
        this.loadingCompanies = false;
      }
    );
  }

  async onCompanySelected(billCompany: OffreService) {
    if (!billCompany.activated) {
      const toast = await this.toastController.create({
        header: 'Service indisponible',
        message: billCompany.reasonDeactivation,
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

  isServiceHidden(company: OffreService) {
    return (
      !company.activated &&
      (!company.reasonDeactivation || company.reasonDeactivation === '')
    );
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
