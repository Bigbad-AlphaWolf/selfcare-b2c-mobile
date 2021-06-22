import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import {
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_MERCHANT_PAYMENT,
  OPERATION_TYPE_RECHARGE_CREDIT,
  IlliflexOption,
} from 'src/shared';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { CreditPassAmountPage } from 'src/app/pages/credit-pass-amount/credit-pass-amount.page';
import { SargalRegistrationPage } from 'src/app/sargal/components/sargal-registration/sargal-registration.page';
import { OfferPlan } from 'src/shared/models/offer-plan.model';
import { RattachedPhonesNumberPage } from 'src/app/pages/rattached-phones-number/rattached-phones-number.page';
import { PurchaseModel } from 'src/app/models/purchase.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationRoutingService {
  constructor(private route: Router) {}

  goToDashboard() {
    this.route.navigate(['/dashboard']);
  }

  goToListPassInternet(data: any) {
    const payload = Object.assign(data, {
      purchaseType: OPERATION_TYPE_PASS_INTERNET,
    });
    let navigationExtras: NavigationExtras = {
      state: {
        payload,
      },
    };
    this.route.navigate(['/list-pass'], navigationExtras);
  }

  goToListPassIllimix(data: any) {
    const payload = Object.assign(data, {
      purchaseType: OPERATION_TYPE_PASS_ILLIMIX,
    });
    let navigationExtras: NavigationExtras = {
      state: {
        payload,
      },
    };
    this.route.navigate(['/list-pass'], navigationExtras);
  }

  goToTransfertHubServicesPage(purchaseType: 'BUY' | 'TRANSFER', isLightMod?) {
    let navigationExtras: NavigationExtras = {
      state: {
        purchaseType,
        isLightMod,
      },
    };
    this.route.navigate(['/transfert-hub-services'], navigationExtras);
  }

  goToSetIlliflexPage(type: IlliflexOption, amount?) {
    let navigationExtras: NavigationExtras = {
      state: {
        type,
        amount,
      },
    };
    const routeUrl =
      type === IlliflexOption.USAGE
        ? '/illiflex-configuration'
        : 'illiflex-budget-configuration';
    this.route.navigate([routeUrl], navigationExtras);
  }

  goToTransfertMoneySetAmountPage(payload: {
    transfertOMType: string;
    senderMsisdn: string;
    recipientMsisdn: string;
    recipientFirstname: string;
    recipientLastname: string;
  }) {
    let navigationExtras: NavigationExtras = {
      state: {
        transfertOMType: payload.transfertOMType,
        senderMsisdn: payload.senderMsisdn,
        recipientMsisdn: payload.recipientMsisdn,
        recipientFirstname: payload.recipientFirstname,
        recipientLastname: payload.recipientLastname,
      },
    };
    this.route.navigate(['/transfert-om-set-amount'], navigationExtras);
  }

  goToTransfertCreditPage() {
    this.route.navigate(['/transfer/credit-bonus']);
  }
  goToTransfertBonusPage() {
    this.route.navigate(['/transfer/credit-bonus']);
  }

  goBuyCredit() {
    this.route.navigate(['/buy-credit']);
  }

  goSetAmountPage(purchaseInformation?: any) {
    let navigationExtras: NavigationExtras = {
      state: purchaseInformation,
    };
    this.route.navigate(['/purchase-set-amount'], navigationExtras);
  }

  goToPassRecapPage(purchaseInformation: {
    pass: any;
    recipientMsisdn: string;
    recipientCodeFormule: string;
    recipientName: string;
    purchaseType: string;
    offerPlan?: OfferPlan;
  }) {
    let navigationExtras: NavigationExtras = {
      state: purchaseInformation,
    };
    this.route.navigate(['/operation-recap'], navigationExtras);
  }

  goToBuyCreditSetAmount(opInfos: OperationExtras) {
    opInfos = { purchaseType: OPERATION_TYPE_RECHARGE_CREDIT, ...opInfos };
    this.route.navigate([CreditPassAmountPage.PATH], { state: opInfos });
  }

  goToRegisterForSargal() {
    this.route.navigate([SargalRegistrationPage.PATH]);
  }

  goToRattachementsPage() {
    this.route.navigate([RattachedPhonesNumberPage.PATH]);
  }

  goToDeleteRattachmentPage() {
    this.route.navigate(['/my-account/delete-number']);
  }

  goToBuyPassInternetKirene() {
    this.route.navigate(['/buy-pass-internet']);
  }

  goToBuyPassIllimixKirene() {
    this.route.navigate(['/buy-pass-illimix']);
  }

  goToTransfertOMKirene() {
    this.route.navigate(['/transfer/orange-money']);
  }

  goToCancelTransactionOM(data: PurchaseModel) {
    let navigationExtras: NavigationExtras = {
      state: { transactionInfos: data },
    };
    this.route.navigate(['/om-self-operation/cancel-transaction'], navigationExtras);
  }
}
