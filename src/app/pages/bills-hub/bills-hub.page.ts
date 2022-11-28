import { Component, OnInit } from '@angular/core';
import { WoyofalSelectionComponent } from 'src/app/components/counter/woyofal-selection/woyofal-selection.component';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import {
  OPERATION_RAPIDO,
  OPERATION_TYPE_PAY_BILL,
  OPERATION_TYPE_SENEAU_BILLS,
  OPERATION_TYPE_SENELEC_BILLS,
  OPERATION_TYPE_TERANGA_BILL,
  OPERATION_WOYOFAL,
  OPERATION_XEWEUL,
} from 'src/app/utils/operations.constants';
import { BillAmountPage } from '../bill-amount/bill-amount.page';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { RapidoOperationPage } from '../rapido-operation/rapido-operation.page';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { Router } from '@angular/router';
import { OffreService } from 'src/app/models/offre-service.model';
import { DEEPLINK_FIXE_BILL_BASE_URL, DEEPLINK_MOBILE_BILL_BASE_URL, getServiceEventLoggingName, HUB_ACTIONS, OPERATION_TYPE_MERCHANT_PAYMENT } from 'src/shared';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { MerchantPaymentCodeComponent } from 'src/shared/merchant-payment-code/merchant-payment-code.component';
import { PurchaseSetAmountPage } from 'src/app/purchase-set-amount/purchase-set-amount.page';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { SelectNumberForBillComponent } from 'src/app/components/select-number-for-bill/select-number-for-bill.component';
import { XeweulOperationPage } from '../xeweul-operation/xeweul-operation.page';
import { TypeCounterModalComponent } from 'src/app/components/type-counter-modal/type-counter-modal.component';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';

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
    private operationService: OperationService,
    private modalController: ModalController,
    private orangeMoneyService: OrangeMoneyService,
    private oemLoggingService: OemLoggingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCompanies();
  }

  async getCompanies() {
    const deeplink = this.router.url;
    if (deeplink.match(DEEPLINK_MOBILE_BILL_BASE_URL)) {
      if (history?.state?.ligne) {
        this.router.navigate([`/payer-teranga/${history?.state?.ligne}`]);
      } else {
        this.openPayBillModal(OPERATION_TYPE_TERANGA_BILL);
      }
    } else if (deeplink.match(DEEPLINK_FIXE_BILL_BASE_URL)) {
      if (history?.state?.ligne) {
        this.router.navigate([`/payer-sonatel/${history?.state?.ligne}`]);
      } else {
        this.openPayBillModal(OPERATION_TYPE_PAY_BILL);
      }
    }
    this.onCompaniesError = false;
    this.loadingCompanies = true;
    this.operationService.getServicesByFormule(HUB_ACTIONS.FACTURES).subscribe(
      (companies: OffreService[]) => {
        this.companies = companies;
        this.loadingCompanies = false;
        this.oemLoggingService.registerEvent('Get_hub_payer_services_success');
      },
      err => {
        this.onCompaniesError = true;
        this.loadingCompanies = false;
        this.oemLoggingService.registerEvent(
          'Get_hub_payer_services_failed',
          convertObjectToLoggingPayload({
            error: err.status,
          })
        );
      }
    );
  }

  async onCompanySelected(billCompany: OffreService) {
    this.oemLoggingService.registerEvent('hub_payer_services_' + getServiceEventLoggingName(billCompany) + '_click', []);
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

    switch (billCompany.code) {
      case OPERATION_WOYOFAL:
        this.bsService.initBsModal(WoyofalSelectionComponent, OPERATION_WOYOFAL, BillAmountPage.ROUTE_PATH).subscribe(_ => {});
        this.bsService.openModal(WoyofalSelectionComponent);
        break;
      case OPERATION_RAPIDO:
        this.navCtrl.navigateForward(RapidoOperationPage.ROUTE_PATH);
        break;
      case OPERATION_XEWEUL:
        this.navCtrl.navigateForward(XeweulOperationPage.ROUTE_PATH);
        break;
      case OPERATION_TYPE_PAY_BILL:
      case OPERATION_TYPE_TERANGA_BILL:
        this.openPayBillModal(billCompany.code, billCompany?.newOffer);
        break;
      case OPERATION_TYPE_MERCHANT_PAYMENT:
        this.openMerchantBS();
        break;
      case OPERATION_TYPE_SENEAU_BILLS:
      case OPERATION_TYPE_SENELEC_BILLS:
        this.bsService.initBsModal(TypeCounterModalComponent, billCompany.code, '/bills').subscribe();
        this.bsService.openModal(TypeCounterModalComponent, { operation: billCompany.code });
        break;
    }
  }

  async openPayBillModal(operation: string, isTaggedAsNew?: boolean) {
    const modal = await this.modalController.create({
      component: SelectNumberForBillComponent,
      cssClass: 'select-recipient-modal',
      componentProps: {
        operation,
        isNewService: isTaggedAsNew
      },
    });
    return await modal.present();
  }

  openMerchantBS() {
    this.orangeMoneyService.omAccountSession().subscribe(async (omSession: any) => {
      const omSessionValid = omSession ? omSession.msisdn !== 'error' && omSession.hasApiKey && !omSession.loginExpired : null;
      if (omSessionValid) {
        this.bsService.initBsModal(MerchantPaymentCodeComponent, OPERATION_TYPE_MERCHANT_PAYMENT, PurchaseSetAmountPage.ROUTE_PATH).subscribe(_ => {});
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
    return !company.activated && (!company.reasonDeactivation || company.reasonDeactivation === '');
  }

  goBack() {
    this.navCtrl.pop();
  }
}
