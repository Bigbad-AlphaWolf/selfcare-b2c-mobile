import { Injectable } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { MatBottomSheet } from '@angular/material';
import { SelectBeneficiaryPopUpComponent } from 'src/app/transfert-hub-services/components/select-beneficiary-pop-up/select-beneficiary-pop-up.component';
import { PurchaseSetAmountPage } from 'src/app/purchase-set-amount/purchase-set-amount.page';
import { NumberSelectionOption } from 'src/app/models/enums/number-selection-option.enum';
import { NumberSelectionComponent } from 'src/app/components/number-selection/number-selection.component';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { OPERATION_TYPE_RECHARGE_CREDIT } from 'src/shared';
import { CreditPassAmountPage } from 'src/app/pages/credit-pass-amount/credit-pass-amount.page';
import { MerchantPaymentCodeComponent } from 'src/shared/merchant-payment-code/merchant-payment-code.component';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { take } from 'rxjs/operators';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {
  constructor(
    private modalController: ModalController,
    private matBottomSheet: MatBottomSheet,
    private navController: NavController,
    private omService: OrangeMoneyService
  ) {}

  public async showBeneficiaryModal() {
    const modal = await this.modalController.create({
      component: SelectBeneficiaryPopUpComponent,
      cssClass: 'customModalCssTrasnfertOMWithoutCode',
    });
    modal.onWillDismiss().then((response: any) => {
      if (response && response.data && response.data.recipientMsisdn) {
        const pageData = response.data;
        this.navController.navigateForward([PurchaseSetAmountPage.ROUTE_PATH], {
          state: response.data,
        });
      }
    });
    return await modal.present();
  }

  public async openNumberSelectionBottomSheet(
    option: NumberSelectionOption,
    purchaseType: string,
    routePath: string
  ) {
    const modal = await this.modalController.create({
      component: NumberSelectionComponent,
      componentProps: { data: { option } },
      cssClass: 'select-recipient-modal',
    });
    modal.onWillDismiss().then((response: any) => {
      if (response && response.data) {
        let opInfos = response.data;
        if (!opInfos || !opInfos.recipientMsisdn) return;
        opInfos = { purchaseType: purchaseType, ...opInfos };
        this.navController.navigateForward([routePath], {
          state: opInfos,
        });
      }
    });
    return await modal.present();
  }

  public openNumberSelectionBottomSheets(
    option: NumberSelectionOption,
    purchaseType: string,
    routePath: string
  ) {
    this.matBottomSheet
      .open(NumberSelectionComponent, {
        data: { option: option },
        backdropClass: 'oem-ion-bottomsheet',
      })
      .afterDismissed()
      .subscribe((opInfos: OperationExtras) => {
        if (!opInfos || !opInfos.recipientMsisdn) return;
        opInfos = { purchaseType: purchaseType, ...opInfos };
        this.navController.navigateForward([routePath], {
          state: opInfos,
        });
      });
  }
  public openMerchantPayment() {
    this.omService
      .getOmMsisdn()
      .pipe(take(1))
      .subscribe((msisdn: string) => {
        if (msisdn !== 'error') {
          this.matBottomSheet
            .open(MerchantPaymentCodeComponent, {
              panelClass: 'merchant-code-modal',
            })
            .afterDismissed()
            .subscribe(() => {});
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
}
