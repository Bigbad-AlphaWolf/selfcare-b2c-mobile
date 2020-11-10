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

@Injectable({
  providedIn: 'root',
})
export class ApplicationRoutingService {
  constructor(private route: Router) {}

  goToDashboard() {
    this.route.navigate(['/dashboard']);
  }

  goToSelectRecepientPassInternet() {
    let navigationExtras: NavigationExtras = {
      state: {
        payload: OPERATION_TYPE_PASS_INTERNET,
      },
    };
    this.route.navigate(['/select-beneficiary-v2'], navigationExtras);
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

  goToSelectRecepientPassIllimix() {
    let navigationExtras: NavigationExtras = {
      state: {
        payload: OPERATION_TYPE_PASS_ILLIMIX,
      },
    };
    this.route.navigate(['/select-beneficiary-v2'], navigationExtras);
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
    type = IlliflexOption.BUDGET;
    let navigationExtras: NavigationExtras = {
      state: {
        type,
        amount,
      },
    };
    this.route.navigate(['/illiflex-configuration'], navigationExtras);
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
}
