import { Injectable } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { MatBottomSheet, MatBottomSheetRef, MatDialog } from '@angular/material';
import { SelectBeneficiaryPopUpComponent } from 'src/app/transfert-hub-services/components/select-beneficiary-pop-up/select-beneficiary-pop-up.component';
import { PurchaseSetAmountPage } from 'src/app/purchase-set-amount/purchase-set-amount.page';
import { NumberSelectionOption } from 'src/app/models/enums/number-selection-option.enum';
import { NumberSelectionComponent } from 'src/app/components/number-selection/number-selection.component';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { take, map } from 'rxjs/operators';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';
import { LinesComponent } from 'src/app/components/lines/lines.component';
import { BillCompany } from 'src/app/models/bill-company.model';
import { Subject } from 'rxjs';
import { OPERATION_SEE_SOLDE_RAPIDO } from 'src/shared';
import { RapidoSoldeComponent } from 'src/app/components/counter/rapido-solde/rapido-solde.component';
import { RattachNumberModalComponent } from 'src/app/components/rattach-number-modal/rattach-number-modal.component';
import { RattachNumberByIdCardComponent } from 'src/app/components/rattach-number-by-id-card/rattach-number-by-id-card.component';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';
import { RattachNumberByClientCodeComponent } from 'src/app/components/rattach-number-by-client-code/rattach-number-by-client-code.component';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { FollowAnalyticsService } from '../follow-analytics/follow-analytics.service';

@Injectable({
  providedIn: 'root',
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
    private omService: OrangeMoneyService,
    private dialog: MatDialog,
    private dashbServ: DashboardService,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  initBsModal(comp: any, purchaseType: string, routePath: string) {
    this.bsModalEl.complete();
    this.bsModalEl = new Subject();
    return this.bsModalEl.pipe(
      map((el) => {
        el.onDidDismiss().then((result: any) => {
          result = result.data;
          let fromFavorites =
            result && result.TYPE_BS === 'FAVORIES' && result.ACTION === 'BACK';

          if (fromFavorites)
            this.openModal(comp, { operation: result.operation });

          if (
            result &&
            result.ACTION === 'FORWARD' &&
            result.operation !== OPERATION_SEE_SOLDE_RAPIDO
          ) {
            this.opXtras.purchaseType = purchaseType;
            this.opXtras.billData
              ? (this.opXtras.billData.counter = result.counter)
              : '';

            this.opXtras.merchant = result.merchant;
            this.navCtl.navigateForward([routePath], {
              state: this.opXtras,
            });
          }
          if (
            result &&
            result.operation === OPERATION_SEE_SOLDE_RAPIDO &&
            result.ACTION === 'FORWARD'
          ) {
            this.openModalSoldeRapido(RapidoSoldeComponent, {
              ...result,
              opXtras: this.opXtras,
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
        backdropClass: 'oem-ion-bottomsheet',
      })
    );
  }

  openBSFavoriteCounters(compType: any) {
    this.bsRef.next(
      this.matBottomSheet.open(compType, {
        backdropClass: 'oem-ion-bottomsheet',
      })
    );
  }

  async openModal(component, data?: any) {
    const modal = await this.modalCtrl.create({
      component,
      componentProps: data,
      cssClass: 'select-recipient-modal',
    });
    this.bsModalEl.next(modal);
    return modal.present();
  }

  async openModalSoldeRapido(component, data?: any) {
    const modal = await this.modalCtrl.create({
      component,
      componentProps: data,
      cssClass: 'select-recipient-modal',
    });
    return modal.present();
  }

  public async showBeneficiaryModal() {
    const modal = await this.modalCtrl.create({
      component: SelectBeneficiaryPopUpComponent,
      cssClass: 'select-recipient-modal',
    });
    modal.onWillDismiss().then((response: any) => {
      if (response && response.data && response.data.recipientMsisdn) {
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
    routePath: string,
    isLightMod?
  ) {
    const modal = await this.modalCtrl.create({
      component: NumberSelectionComponent,
      componentProps: { data: { option, purchaseType, isLightMod } },
      cssClass: 'select-recipient-modal',
    });
    modal.onWillDismiss().then((response: any) => {
      if (response && response.data) {
        let opInfos = response.data;
        if (!opInfos || !opInfos.recipientMsisdn) return;
        opInfos = { purchaseType: purchaseType, isLightMod, ...opInfos };
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
        if (msisdn !== 'error') {
          this.matBottomSheet
            .open(component, {
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
    const modal = await this.modalCtrl.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
    });
    return await modal.present();
  }

  public openLinesBottomSheet() {
    this.matBottomSheet
      .open(LinesComponent, {
        backdropClass: 'oem-ion-bottomsheet',
      })
      .afterDismissed()
      .subscribe(() => {});
  }

  async openRattacheNumberModal() {
    const modal = await this.modalCtrl.create({
      component: RattachNumberModalComponent,
      cssClass: 'select-recipient-modal'
    });

    modal.onDidDismiss().then((res: any) => {
      console.log(res);
      res = res.data;      
      if(res && !res.rattached) {
        const numero = res.numeroToRattach;        
        if(res.typeRattachment === 'MOBILE') {
          this.openRattacheNumberByIdCardModal(numero);
        } else if (res.typeRattachment === 'FIXE') {
          this.openRattacheNumberByCustomerIdModal(numero);
        }
      }
      
    })
    return await modal.present();
  }

  async openRattacheNumberByIdCardModal(number: string) {
    const modal = await this.modalCtrl.create({
      component: RattachNumberByIdCardComponent,
      componentProps: {
        number
      },
      cssClass: 'select-recipient-modal'
    });
    modal.onDidDismiss().then((res: any) => {
      res = res.data;      
      if(res.direction === "BACK"){
        this.openRattacheNumberModal();
      } else {        
        if(res.rattached ) {          
          const numero = res.numeroToRattach;
          this.actualiseRattachmentList();
          this.openSuccessDialog('rattachment-success', numero);
        } else {          
          this.openSuccessDialog('rattachment-failed');
        }
      }
    })
    return await modal.present();
  }

  async openRattacheNumberByCustomerIdModal(number: string) {
    const modal = await this.modalCtrl.create({
      component: RattachNumberByClientCodeComponent,
      componentProps: {
        number
      },
      cssClass: 'select-recipient-modal'
    });
    modal.onDidDismiss().then((res: any) => {
      res = res.data;
      if(res.direction === "BACK"){
        this.openRattacheNumberModal();
      } else {
        if(res.rattached ) {
          const numero = res.numeroToRattach;
          this.actualiseRattachmentList();
          this.openSuccessDialog('rattachment-success', numero);
        } else {
          this.openSuccessDialog('rattachment-failed');
        }
      }
    })

    return await modal.present();
  }

  openSuccessDialog(dialogType: string,phoneNumber?: string) {
    this.dialog.open(ModalSuccessComponent, {
      data: { type: dialogType, rattachedNumber: phoneNumber },
      width: '95%',
      maxWidth: '375px'
    });
  }

  actualiseRattachmentList() {
    DashboardService.rattachedNumbers = null;
    this.dashbServ.attachedNumbers().pipe(take(1)).subscribe();
  }

  followAttachmentIssues(
    payload: { login: string; numero: string; typeNumero: string },
    eventType: 'error' | 'event'
  ) {
    if (eventType === 'event') {
      const infosFollow = {
        attached_number: payload.numero,
        login: payload.login
      };
      const eventName = `rattachment_${
        payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'
      }_success`;
      this.followAnalyticsService.registerEventFollow(
        eventName,
        eventType,
        infosFollow
      );
    } else {
      const infosFollow = {
        number_to_attach: payload.numero,
        login: payload.login
      };
      const errorName = `rattachment_${
        payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'
      }_failed`;
      this.followAnalyticsService.registerEventFollow(
        errorName,
        eventType,
        infosFollow
      );
    }
  }

}
