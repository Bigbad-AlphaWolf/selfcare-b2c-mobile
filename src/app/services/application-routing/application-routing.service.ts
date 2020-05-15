import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import {
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_MERCHANT_PAYMENT,
} from 'src/shared';

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

  goToTransfertHubServicesPage(purchaseType: 'BUY' | 'TRANSFER') {
    let navigationExtras: NavigationExtras = {
      state: {
        purchaseType,
      },
    };
    this.route.navigate(['/transfert-hub-services'], navigationExtras);
  }

  goToTransfertMoneyPage() {
    this.route.navigate(['/transfert-om-hub-services']);
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

  goToTransfertMoneyRecapPage(payload: {
    transfertOMType: string;
    recipientMsisdn: string;
    recipientFirstname: string;
    recipientLastname: string;
    transfertOMAmount: number;
  }) {
    let navigationExtras: NavigationExtras = {
      state: {
        transfertOMType: payload.transfertOMType,
        recipientMsisdn: payload.recipientMsisdn,
        recipientFirstname: payload.recipientFirstname,
        recipientLastname: payload.recipientLastname,
        transfertOMAmount: payload.transfertOMAmount,
      },
    };
    this.route.navigate(['/transfert-om-recapitulatif'], navigationExtras);
  }
  goToTransfertCreditPage() {
    // this.route.navigate(['/'])
  }
  goToTransfertBonusPage() {
    // this.route.navigate(['/'])
  }

  goBuyCredit() {
    this.route.navigate(['/buy-credit']);
  }

  goSetAmountPage(purchaseInformation: any) {
    let navigationExtras: NavigationExtras = {
      state: purchaseInformation,
    };
    this.route.navigate(['/purchase-set-amount'], navigationExtras);
  }
}
