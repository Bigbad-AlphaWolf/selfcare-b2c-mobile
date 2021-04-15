import { Component, OnInit } from '@angular/core';
import { RAPIDO, WOYOFAL } from 'src/app/utils/bills.util';
import { WoyofalSelectionComponent } from 'src/app/components/counter/woyofal-selection/woyofal-selection.component';
import {
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { OPERATION_WOYOFAL } from 'src/app/utils/operations.constants';
import { BillAmountPage } from '../bill-amount/bill-amount.page';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { RapidoOperationPage } from '../rapido-operation/rapido-operation.page';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { Router } from '@angular/router';
import { OffreService } from 'src/app/models/offre-service.model';
import { HUB_ACTIONS, OPERATION_TYPE_MERCHANT_PAYMENT } from 'src/shared';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { MerchantPaymentCodeComponent } from 'src/shared/merchant-payment-code/merchant-payment-code.component';
import { PurchaseSetAmountPage } from 'src/app/purchase-set-amount/purchase-set-amount.page';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

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
    private operationService: OperationService,
    private modalController: ModalController,
    private orangeMoneyService: OrangeMoneyService,
    private followAnalyticsService: FollowAnalyticsService
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
        this.followAnalyticsService.registerEventFollow(
          'Get_hub_payer_services_success',
          'event'
        );
      },
      (err) => {
        this.onCompaniesError = true;
        this.loadingCompanies = false;
        this.followAnalyticsService.registerEventFollow(
          'Get_hub_payer_services_failed',
          'error',
          { error: err.status }
        );
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

    if (billCompany.code === OPERATION_TYPE_MERCHANT_PAYMENT) {
      this.openMerchantBS();
      return;
    }

    if (billCompany.code === RAPIDO) {
      this.navCtrl.navigateForward(RapidoOperationPage.ROUTE_PATH);
      return;
    }
    //this will change
  }

  openMerchantBS() {
    this.orangeMoneyService
      .omAccountSession()
      .subscribe(async (omSession: any) => {
        const omSessionValid = omSession
          ? omSession.msisdn !== 'error' &&
            omSession.hasApiKey &&
            !omSession.loginExpired
          : null;
        if (omSessionValid) {
          this.bsService
            .initBsModal(
              MerchantPaymentCodeComponent,
              OPERATION_TYPE_MERCHANT_PAYMENT,
              PurchaseSetAmountPage.ROUTE_PATH
            )
            .subscribe((_) => {});
          this.bsService.openModal(MerchantPaymentCodeComponent);
        } else {
          this.openPinpad();
        }
      });
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
    });
    return await modal.present();
  }

  isServiceHidden(company: OffreService) {
    console.log(
      company.libelle,
      !company.activated &&
        (!company.reasonDeactivation || company.reasonDeactivation === '')
    );
    return (
      !company.activated &&
      (!company.reasonDeactivation || company.reasonDeactivation === '')
    );
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
