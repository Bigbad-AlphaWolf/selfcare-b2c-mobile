import { Injectable } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { MatDialog } from '@angular/material/dialog';
import { SelectBeneficiaryPopUpComponent } from 'src/app/transfert-hub-services/components/select-beneficiary-pop-up/select-beneficiary-pop-up.component';
import { NumberSelectionOption } from 'src/app/models/enums/number-selection-option.enum';
import { NumberSelectionComponent } from 'src/app/components/number-selection/number-selection.component';
import { OperationExtras } from 'src/app/models/operation-extras.model';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { take, map } from 'rxjs/operators';
import { OrangeMoneyService } from '../orange-money-service/orange-money.service';
import { LinesComponent } from 'src/app/components/lines/lines.component';
import { BillCompany } from 'src/app/models/bill-company.model';
import { Subject } from 'rxjs';
import {
  OPERATION_SEE_SOLDE_RAPIDO,
  OPERATION_SEE_SOLDE_XEWEUL,
  OPERATION_TYPE_PASS_ALLO,
  OPERATION_TYPE_PASS_ILLIFLEX,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_VOYAGE,
  OPERATION_TYPE_RECHARGE_CREDIT,
  STEPS_ACCESS_BY_OTP,
  SubscriptionModel,
} from 'src/shared';
import { RapidoSoldeComponent } from 'src/app/components/counter/rapido-solde/rapido-solde.component';
import { RattachNumberModalComponent } from 'src/app/pages/rattached-phones-number/components/rattach-number-modal/rattach-number-modal.component';
import { RattachNumberByIdCardComponent } from 'src/app/pages/rattached-phones-number/components/rattach-number-by-id-card/rattach-number-by-id-card.component';
import { ModalSuccessComponent } from 'src/shared/modal-success/modal-success.component';
import { RattachNumberByClientCodeComponent } from 'src/app/pages/rattached-phones-number/components/rattach-number-by-client-code/rattach-number-by-client-code.component';
import { IdentifiedNumbersListComponent } from 'src/app/pages/rattached-phones-number/components/identified-numbers-list/identified-numbers-list.component';
import { RattachedNumber } from 'src/app/models/rattached-number.model';
import { ChooseRattachementTypeModalComponent } from 'src/app/pages/rattached-phones-number/components/choose-rattachement-type-modal/choose-rattachement-type-modal.component';
import { BannierePubModel } from '../dashboard-service';
import { BanniereDescriptionPage } from 'src/app/pages/banniere-description/banniere-description.page';
import { OffreService } from 'src/app/models/offre-service.model';
import { TransferSetAmountPage } from 'src/app/transfer-set-amount/transfer-set-amount.page';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { TRANSFER_OM_INTERNATIONAL_COUNTRIES } from 'src/app/utils/constants';
import { XeweulSoldeComponent } from '../../components/counter/xeweul-solde/xeweul-solde.component';
import { TypePhoneNumberManuallyComponent } from 'src/app/new-registration/components/type-phone-number-manually/type-phone-number-manually.component';
import { NavigationExtras } from '@angular/router';
import { RattachByOtpCodeComponent } from 'src/app/pages/rattached-phones-number/components/rattach-by-otp-code/rattach-by-otp-code.component';
import { InfosLigneFixeComponent } from 'src/shared/infos-ligne-fixe/infos-ligne-fixe.component';
import { ListeAnnulationTrxComponent } from 'src/app/details-conso/components/liste-annulation-trx/liste-annulation-trx.component';
import { OemLoggingService } from '../oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';

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
    private oemLoggingService: OemLoggingService,
    private socialSharing: SocialSharing
  ) {}

  initBsModal(comp: any, purchaseType: string, routePath: string) {
    this.bsModalEl.complete();
    this.bsModalEl = new Subject();
    return this.bsModalEl.pipe(
      map(el => {
        el.onDidDismiss().then((result: any) => {
          console.log(result);

          result = result.data;
          let fromFavorites = result && result.TYPE_BS === 'FAVORIES' && result.ACTION === 'BACK';

          if (fromFavorites) this.openModal(comp, { operation: result.operation });

          if (result && result.ACTION === 'FORWARD' && result.operation !== OPERATION_SEE_SOLDE_RAPIDO && result.operation !== OPERATION_SEE_SOLDE_XEWEUL) {
            this.opXtras.purchaseType = purchaseType;
            this.opXtras.billData ? (this.opXtras.billData.counter = result.counter) : '';

            this.opXtras.merchant = result.merchant;

            // for SENELEC & SENEAU payment
            this.opXtras['operationType'] = purchaseType;
            this.opXtras['ligne'] = result?.ligne;
            this.opXtras['type'] = result?.type;
            console.log(this.opXtras);
            // END
            this.navCtl.navigateForward([routePath], {
              state: this.opXtras,
            });
          }
          if (result && result.operation === OPERATION_SEE_SOLDE_RAPIDO && result.ACTION === 'FORWARD') {
            this.openModalSoldeRapido(RapidoSoldeComponent, {
              ...result,
              opXtras: this.opXtras,
            });
          }
          if (result && result.operation === OPERATION_SEE_SOLDE_XEWEUL && result.ACTION === 'FORWARD') {
            this.openModalSoldeRapido(XeweulSoldeComponent, {
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
      componentProps: {
        country: TRANSFER_OM_INTERNATIONAL_COUNTRIES[0],
      },
    });
    modal.onWillDismiss().then((response: any) => {
      if (response && response.data && response.data.recipientMsisdn) {
        this.navCtl.navigateForward([TransferSetAmountPage.ROUTE_PATH], {
          state: response.data,
        });
      }
    });
    return await modal.present();
  }

  public async openNumberSelectionBottomSheet(option: NumberSelectionOption, purchaseType: string, routePath: string, serviceUsage?: OffreService, opXtras?: OperationExtras) {
    const modal = await this.modalCtrl.create({
      component: NumberSelectionComponent,
      componentProps: {
        data: { option, purchaseType, serviceUsage, opXtras },
      },
      cssClass: ['select-recipient-modal'],
      mode: 'ios',
      swipeToClose: true,
    });
    modal.onWillDismiss().then((response: any) => {
      if (response && response.data) {
        console.log('opInfos', response.data);
        let opInfos = response.data;
        if (!opInfos || !opInfos.recipientMsisdn) return;
        opInfos = {
          purchaseType: purchaseType,
          serviceUsage,
          ...opXtras,
          ...opInfos,
        };
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

  async openRattacheNumberModal(phoneNumber?: string) {
    this.oemLoggingService.registerEvent('Ouverture_modal_rattachement_numéros');
    const modal = await this.modalCtrl.create({
      component: RattachNumberModalComponent,
      componentProps: {
        phoneNumber,
      },
      cssClass: 'select-recipient-modal',
    });

    modal.onDidDismiss().then((res: any) => {
      res = res.data;
      if (res && res?.direction === 'ORANGE_NUMBERS') {
        this.openIdentifiedNumbersList();
      } else if (res?.direction === 'FORWARD') {
        const numero = res.numeroToRattach;
        const typeRattachment = res.typeRattachment;
        if (typeRattachment === 'FIXE') {
          this.openSelectRattachmentType(numero);
        } else {
          this.openRattacheNumberByIdCardModal(numero);
        }
      } else if (res?.direction === 'SENT_OTP') {
        this.openRattacheNumberByOTPModal(res.numeroToRattach);
      }
    });
    return await modal.present();
  }

  async openSelectRattachmentType(phoneNumber?: string) {
    const modal = await this.modalCtrl.create({
      component: ChooseRattachementTypeModalComponent,
      componentProps: {
        phoneNumber,
      },
      cssClass: 'select-recipient-modal',
    });

    modal.onDidDismiss().then((res: any) => {
      res = res.data;
      if (res && res.typeRattachment) {
        const numero = res.numeroToRattach;
        if (res.typeRattachment === 'CIN') {
          this.openRattacheNumberByIdCardModal(phoneNumber);
        } else if (res.typeRattachment === 'IDCLIENT') {
          this.openRattacheNumberByCustomerIdModal(phoneNumber);
        }
      } else if (res?.direction === 'BACK') {
        this.openRattacheNumberModal();
      }
    });
    return await modal.present();
  }

  async openRattacheNumberByIdCardModal(number: string) {
    const modal = await this.modalCtrl.create({
      component: RattachNumberByIdCardComponent,
      componentProps: {
        number,
      },
      cssClass: 'select-recipient-modal',
    });
    modal.onDidDismiss().then((res: any) => {
      res = res.data;
      if (res?.direction === 'BACK') {
        const typeRattachment = res.typeRattachment;
        if (typeRattachment === 'MOBILE') {
          this.openRattacheNumberModal();
        } else {
          this.openSelectRattachmentType(number);
        }
      } else {
        if (res.rattached) {
          const numero = res.numeroToRattach;
          this.openSuccessDialog('rattachment-success', numero);
        } else {
          this.openSuccessDialog('rattachment-failed', null, res.errorMsg, res.errorStatus);
        }
      }
    });
    return await modal.present();
  }
  async openRattacheNumberByOTPModal(number: string) {
    const modal = await this.modalCtrl.create({
      component: RattachByOtpCodeComponent,
      componentProps: {
        number,
      },
      cssClass: 'select-recipient-modal',
    });
    modal.onDidDismiss().then((res: any) => {
      res = res.data;
      if (res?.direction === 'BACK') {
        this.openRattacheNumberModal();
      } else {
        if (res) {
          if (res?.rattached) {
            const numero = res.numeroToRattach;
            this.openSuccessDialog('rattachment-success', numero);
          } else {
            this.openSuccessDialog('rattachment-failed', null, res.errorMsg, res.errorStatus);
          }
        }
      }
    });
    return await modal.present();
  }

  async openRattacheNumberByCustomerIdModal(number: string) {
    const modal = await this.modalCtrl.create({
      component: RattachNumberByClientCodeComponent,
      componentProps: {
        number,
      },
      cssClass: 'select-recipient-modal',
    });
    modal.onDidDismiss().then((res: any) => {
      res = res.data;
      if (res) {
        if (res?.direction === 'BACK') {
          this.openSelectRattachmentType(number);
        } else {
          if (res?.rattached) {
            const numero = res.numeroToRattach;
            this.openSuccessDialog('rattachment-success', numero);
          } else {
            this.openSuccessDialog('rattachment-failed', null, res.errorMsg, res.errorStatus);
          }
        }
      }
    });

    return await modal.present();
  }

  openSuccessDialog(dialogType: string, phoneNumber?: string, errorMsg?: string, errorStatus?: any) {
    this.dialog.open(ModalSuccessComponent, {
      data: {
        type: dialogType,
        errorStatus: errorStatus,
        errorMsg: errorMsg,
        rattachedNumber: phoneNumber,
      },
      width: '95%',
      maxWidth: '375px',
    });
  }

  async openIdentifiedNumbersList(rattachedNumbers?: RattachedNumber[]) {
    const modal = await this.modalCtrl.create({
      component: IdentifiedNumbersListComponent,
      componentProps: {
        rattachedNumbers,
      },
      cssClass: 'select-recipient-modal',
    });
    modal.onDidDismiss().then((res: any) => {
      res = res.data;
      if (res?.direction === 'BACK') {
        this.openRattacheNumberModal();
      } else {
        this.openRattacheNumberModal(res.numeroToAttach);
      }
    });

    return await modal.present();
  }

  followAttachmentIssues(payload: { login: string; numero: string; typeNumero: string }, eventType: 'error' | 'event') {
    if (eventType === 'event') {
      const infosFollow = {
        attached_number: payload.numero,
        login: payload.login,
      };
      const eventName = `rattachment_${payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'}_success`;
      this.oemLoggingService.registerEvent(eventName, convertObjectToLoggingPayload(infosFollow));
    } else {
      const infosFollow = {
        number_to_attach: payload.numero,
        login: payload.login,
      };
      const errorName = `rattachment_${payload.typeNumero === 'FIXE' ? 'fixe' : 'mobile'}_failed`;
      this.oemLoggingService.registerEvent(errorName, convertObjectToLoggingPayload(infosFollow));
    }
  }

  public async openBannerDescription(banner: BannierePubModel) {
    const modal = await this.modalCtrl.create({
      component: BanniereDescriptionPage,
      componentProps: { banniere: banner },
      cssClass: 'select-recipient-modal',
    });
    return await modal.present();
  }

  logRecipientOnFollow(purchaseType: string, infos: any, isLightMod?: boolean) {
    let followEvent: string;
    let payload: any;
    switch (purchaseType) {
      case OPERATION_TYPE_RECHARGE_CREDIT:
        followEvent = 'Recharge_Credit_Select_Recipient_success';
        payload = {
          sender: infos.senderMsisdn,
          recipient: infos.recipientMsisdn,
          operation: purchaseType.toLowerCase(),
        };
        break;
      case OPERATION_TYPE_PASS_INTERNET:
      case OPERATION_TYPE_PASS_ILLIMIX:
      case OPERATION_TYPE_PASS_ILLIFLEX:
      case OPERATION_TYPE_PASS_VOYAGE:
      case OPERATION_TYPE_PASS_ALLO:
        followEvent = 'Achat_pass_Select_Recipient_success';
        payload = {
          sender: infos.senderMsisdn,
          recipient: infos.recipientMsisdn,
          operation: purchaseType.toLowerCase(),
        };
        break;

      default:
        break;
    }
    console.log('follow', followEvent, payload);

    this.oemLoggingService.registerEvent(followEvent, convertObjectToLoggingPayload(payload));
  }

  defaulSharingSheet() {
    this.oemLoggingService.registerEvent('Partager_app_menu');
    const url = 'http://bit.ly/2NHn5aS';
    const postTitle =
      "Comme moi télécharge et connecte toi gratuitement sur l'application " +
      'Orange et Moi Fi rek la http://onelink.to/6h78t2 ou sur www.orangeetmoi.sn ' +
      'Bu ande ak simplicité ak réseau mo gën #WaawKay';
    const hashtag = '#WaawKay';

    this.socialSharing
      .share(postTitle, null, null, url)
      .then()
      .catch((err: any) => {
        console.log('Cannot open default sharing sheet' + err);
      });
  }

  async enterUserPhoneNumber(phone?: string, step?: STEPS_ACCESS_BY_OTP, hmacExpired?: boolean) {
    const isModalOpened = this.modalCtrl.getTop();
    if (isModalOpened) this.modalCtrl.dismiss();
    const modal = await this.modalCtrl.create({
      component: TypePhoneNumberManuallyComponent,
      cssClass: 'select-recipient-modal',
      componentProps: {
        phoneNumber: phone,
        step,
        hmacExpired,
      },
      presentingElement: await this.modalCtrl.getTop(),
      backdropDismiss: true,
    });
    modal.onDidDismiss().then(response => {
      if (response.data?.success) {
        const navExtras: NavigationExtras = {
          state: {
            fromOTPSMS: true,
          },
        };
        this.navCtl.navigateRoot(['/new-registration'], navExtras);
      }
    });
    return await modal.present();
  }

  async openInfosLigneFixe(ligneNumber: string, customerOfferInfos: SubscriptionModel) {
    const modal = await this.modalCtrl.create({
      component: InfosLigneFixeComponent,
      componentProps: {
        ligneNumber,
        customerOfferInfos,
        showClose: true,
      },
      cssClass: 'select-recipient-modal',
    });

    return await modal.present();
  }

  async openListeAnnulationTrxForMLite(listAnnulationTrx?: any) {
    return this.modalCtrl.create({
      component: ListeAnnulationTrxComponent,
      componentProps: {
        listAnnulationTrx,
      },
      cssClass: 'select-recipient-modal',
    });
  }
}
