import {Injectable} from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import {
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_RECHARGE_CREDIT,
  IlliflexOption,
  OPERATION_CHANGE_PIN_OM
} from 'src/shared';
import {OperationExtras} from 'src/app/models/operation-extras.model';
import {CreditPassAmountPage} from 'src/app/pages/credit-pass-amount/credit-pass-amount.page';
import {SargalRegistrationPage} from 'src/app/sargal/components/sargal-registration/sargal-registration.page';
import {OfferPlan} from 'src/shared/models/offer-plan.model';
import {RattachedPhonesNumberPage} from 'src/app/pages/rattached-phones-number/rattached-phones-number.page';
import {PurchaseModel} from 'src/app/models/purchase.model';
import {PurchaseSetAmountPage} from 'src/app/purchase-set-amount/purchase-set-amount.page';
import {TransferSetAmountPage} from 'src/app/transfer-set-amount/transfer-set-amount.page';
@Injectable({
  providedIn: 'root'
})
export class ApplicationRoutingService {
  constructor(private route: Router) {}

  goToDashboard() {
    this.route.navigate(['/dashboard']);
  }

  goToListPassInternet(data: any) {
    const payload = Object.assign(data, {
      purchaseType: OPERATION_TYPE_PASS_INTERNET
    });
    let navigationExtras: NavigationExtras = {
      state: {
        payload
      }
    };
    this.route.navigate(['/list-pass'], navigationExtras);
  }

  goToListPassIllimix(data: any) {
    const payload = Object.assign(data, {
      purchaseType: OPERATION_TYPE_PASS_ILLIMIX
    });
    let navigationExtras: NavigationExtras = {
      state: {
        payload
      }
    };
    this.route.navigate(['/list-pass'], navigationExtras);
  }

  goToTransfertHubServicesPage(purchaseType: 'BUY' | 'TRANSFER', isLightMod?) {
    let navigationExtras: NavigationExtras = {
      state: {
        purchaseType,
        isLightMod
      }
    };
		console.log('navigationExtras', navigationExtras);

    this.route.navigate(['/transfert-hub-services'], navigationExtras);
  }

  goToSetIlliflexPage(type: IlliflexOption, amount?) {
    let navigationExtras: NavigationExtras = {
      state: {
        type,
        amount
      }
    };
    const routeUrl = type === IlliflexOption.USAGE ? '/illiflex-configuration' : 'illiflex-budget-configuration';
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
        recipientLastname: payload.recipientLastname
      }
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
      state: purchaseInformation
    };
    this.route.navigate([PurchaseSetAmountPage.ROUTE_PATH], navigationExtras);
  }

  goSetTransferAmountPage(purchaseInformation?: any) {
    let navigationExtras: NavigationExtras = {
      state: {...purchaseInformation, checkRecipient: true}
    };
    this.route.navigate([TransferSetAmountPage.ROUTE_PATH], navigationExtras);
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
      state: purchaseInformation
    };
    this.route.navigate(['/operation-recap'], navigationExtras);
  }

  goToBuyCreditSetAmount(opInfos: OperationExtras) {
    opInfos = {purchaseType: OPERATION_TYPE_RECHARGE_CREDIT, ...opInfos};
    this.route.navigate([CreditPassAmountPage.PATH], {state: opInfos});
  }

  goToRegisterForSargal(from?: string) {
    this.route.navigate([SargalRegistrationPage.PATH], {state: {previousPage: from}});
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

  goToParainnagePage(sponseeMsisdn?: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        sponseeMsisdn
      }
    };
    this.route.navigate(['/parrainage'], navigationExtras);
  }

  goToCancelTransactionOM(data: PurchaseModel) {
    let navigationExtras: NavigationExtras = {
      state: {transactionInfos: data}
    };
    this.route.navigate(['/om-self-operation/cancel-transaction'], navigationExtras);
  }

  goToCreatePinOM(operationType = OPERATION_CHANGE_PIN_OM, payload?: any) {
    let navigationExtras: NavigationExtras = {
      state: {operation: operationType, payload}
    };
    this.route.navigate(['/change-orange-money-pin'], navigationExtras);
  }

  goToSelectBeneficiaryPage(operationType?: string, payload?: any) {
    let navigationExtras: NavigationExtras = {
      state: {operation: operationType, payload}
    };
    this.route.navigate(['/new-select-beneficiary'], navigationExtras);
  }
}
