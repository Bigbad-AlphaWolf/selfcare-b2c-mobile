import { Injectable } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";
import { MatBottomSheet } from "@angular/material";
import { SelectBeneficiaryPopUpComponent } from "src/app/transfert-hub-services/components/select-beneficiary-pop-up/select-beneficiary-pop-up.component";
import { PurchaseSetAmountPage } from "src/app/purchase-set-amount/purchase-set-amount.page";
import { NumberSelectionOption } from "src/app/models/enums/number-selection-option.enum";
import { NumberSelectionComponent } from "src/app/components/number-selection/number-selection.component";
import { OperationExtras } from "src/app/models/operation-extras.model";
import { OPERATION_TYPE_RECHARGE_CREDIT } from "src/shared";
import { CreditPassAmountPage } from "src/app/pages/credit-pass-amount/credit-pass-amount.page";

@Injectable({
  providedIn: "root",
})
export class BottomSheetService {
  constructor(
    private modalController: ModalController,
    private matBottomSheet: MatBottomSheet,
    private navController: NavController
  ) {}

  public async showBeneficiaryModal() {
    const modal = await this.modalController.create({
      component: SelectBeneficiaryPopUpComponent,
      cssClass: "customModalCssTrasnfertOMWithoutCode",
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

  public openNumberSelectionBottomSheet(option?: NumberSelectionOption) {
    this.matBottomSheet
      .open(NumberSelectionComponent, {
        data: { option: option },
      })
      .afterDismissed()
      .subscribe((opInfos: OperationExtras) => {
        if (!opInfos || !opInfos.recipientMsisdn) return;
        opInfos = { purchaseType: OPERATION_TYPE_RECHARGE_CREDIT, ...opInfos };
        this.navController.navigateForward([CreditPassAmountPage.PATH], {
          state: opInfos,
        });
      });
  }
}
