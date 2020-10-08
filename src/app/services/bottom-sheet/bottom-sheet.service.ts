import { Injectable } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material";
import { SelectBeneficiaryPopUpComponent } from "src/app/transfert-hub-services/components/select-beneficiary-pop-up/select-beneficiary-pop-up.component";
import { PurchaseSetAmountPage } from "src/app/purchase-set-amount/purchase-set-amount.page";
import { NumberSelectionOption } from "src/app/models/enums/number-selection-option.enum";
import { NumberSelectionComponent } from "src/app/components/number-selection/number-selection.component";
import { OperationExtras } from "src/app/models/operation-extras.model";
import { NewPinpadModalPage } from "src/app/new-pinpad-modal/new-pinpad-modal.page";
import { take, map } from "rxjs/operators";
import { OrangeMoneyService } from "../orange-money-service/orange-money.service";
import { LinesComponent } from "src/app/components/lines/lines.component";
import { BillCompany } from "src/app/models/bill-company.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class BottomSheetService {
  opXtras: OperationExtras = {};
  companySelected: BillCompany;
  bsRef: Subject<MatBottomSheetRef> = new Subject();
  bsModalEl: Subject<HTMLIonModalElement> = new Subject();
  constructor(
    private matBottomSheet: MatBottomSheet,
    private modalCtrl: ModalController,
    private navCtl: NavController,
    private omService: OrangeMoneyService
  ) {}

  initBsModal(comp: any, purchaseType: string, routePath: string) {
    this.bsModalEl.complete();
    this.bsModalEl = new Subject();
    return this.bsModalEl.pipe(
      map((el) => {
        el.onDidDismiss().then((result: any) => {
          result = result.data;
          let fromFavorites =
            result && result.TYPE_BS === "FAVORIES" && result.ACTION === "BACK";

          if (fromFavorites) this.openModal(comp);

          if (result && result.ACTION === "FORWARD") {
            this.opXtras.purchaseType = purchaseType;
            this.opXtras.billData
              ? (this.opXtras.billData.counter = result.counter)
              : '';
            
            this.opXtras.merchant = result.merchant;
            this.navCtl.navigateForward([routePath], {
              state: this.opXtras,
            });
          }
        });
      })
    );
  }

  openBSCounterSelection(compType?: any) {
    this.bsRef.next(
      this.matBottomSheet.open(compType, {
        data: { billCompany: this.companySelected },
        backdropClass: "oem-ion-bottomsheet",
      })
    );
  }

  openBSFavoriteCounters(compType: any) {
    this.bsRef.next(
      this.matBottomSheet.open(compType, {
        backdropClass: "oem-ion-bottomsheet",
      })
    );
  }

  async openModal(component) {
    const modal = await this.modalCtrl.create({
      component,
      cssClass: "select-recipient-modal",
    });
    this.bsModalEl.next(modal);
    return modal.present();
  }

  public async showBeneficiaryModal() {
    const modal = await this.modalCtrl.create({
      component: SelectBeneficiaryPopUpComponent,
      cssClass: "select-recipient-modal",
    });
    modal.onWillDismiss().then((response: any) => {
      if (response && response.data && response.data.recipientMsisdn) {
        const pageData = response.data;
        this.navCtl.navigateForward([PurchaseSetAmountPage.ROUTE_PATH], {
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
    const modal = await this.modalCtrl.create({
      component: NumberSelectionComponent,
      componentProps: { data: { option, purchaseType } },
      cssClass: "select-recipient-modal",
    });
    modal.onWillDismiss().then((response: any) => {
      if (response && response.data) {
        let opInfos = response.data;
        if (!opInfos || !opInfos.recipientMsisdn) return;
        opInfos = { purchaseType: purchaseType, ...opInfos };
        this.navCtl.navigateForward([routePath], {
          state: opInfos,
        });
      }
    });
    return await modal.present();
  }

  public openMerchantPayment(component) {
    this.omService
      .getOmMsisdn()
      .pipe(take(1))
      .subscribe((msisdn: string) => {
        if (msisdn !== "error") {
          this.matBottomSheet
            .open(component, {
              panelClass: "merchant-code-modal",
            })
            .afterDismissed()
            .subscribe(() => {});
        } else {
          this.openPinpad();
        }
      });
  }

  async openPinpad() {
    const modal = await this.modalCtrl.create({
      component: NewPinpadModalPage,
      cssClass: "pin-pad-modal",
    });
    return await modal.present();
  }

  public openLinesBottomSheet() {
    this.matBottomSheet
      .open(LinesComponent, {
        backdropClass: "oem-ion-bottomsheet",
      })
      .afterDismissed()
      .subscribe((opInfos: OperationExtras) => {});
  }
}
