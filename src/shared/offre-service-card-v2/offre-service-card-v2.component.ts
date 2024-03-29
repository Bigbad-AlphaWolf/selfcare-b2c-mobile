import { Component, Input, OnInit } from '@angular/core';
import { NavController, ToastController, ModalController, Platform } from '@ionic/angular';
import { WoyofalSelectionComponent } from 'src/app/components/counter/woyofal-selection/woyofal-selection.component';
import { NumberSelectionOption } from 'src/app/models/enums/number-selection-option.enum';
import { ServiceCode } from 'src/app/models/enums/service-code.enum';
import { OffreService } from 'src/app/models/offre-service.model';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { BillAmountPage } from 'src/app/pages/bill-amount/bill-amount.page';
import { PurchaseSetAmountPage } from 'src/app/purchase-set-amount/purchase-set-amount.page';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { OfcService } from 'src/app/services/ofc/ofc.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { FILE_DOWNLOAD_ENDPOINT } from 'src/app/services/utils/file.endpoints';
import { OPERATION_TYPE_PASS_USAGE, OPERATION_WOYOFAL } from 'src/app/utils/operations.constants';
import { isExternallURL } from 'src/app/utils/utils';
import {
  INFOS_ABONNEMENT_FIXE,
  OPERATION_CHECK_OM_ACCOUNT_STATUS,
  OPERATION_RATTACH_NUMBER,
  OPERATION_SHARE_THE_APP,
  OPERATION_TYPE_MERCHANT_PAYMENT,
  OPERATION_TYPE_SEDDO_BONUS,
  OPERATION_TYPE_SEDDO_CREDIT,
  SubscriptionModel,
} from '..';
import { MerchantPaymentCodeComponent } from '../merchant-payment-code/merchant-payment-code.component';
import { OmStatusVisualizationComponent } from '../om-status-visualization/om-status-visualization.component';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-offre-service-card-v2',
  templateUrl: './offre-service-card-v2.component.html',
  styleUrls: ['./offre-service-card-v2.component.scss'],
})
export class OffreServiceCardV2Component implements OnInit {
  @Input() service: OffreService;
  @Input() style: 'v1' | 'v2' = 'v1';
  FILE_BASE_URL: string = FILE_DOWNLOAD_ENDPOINT;

  imageUrl: string;
  @Input() phone: string;
  @Input() currentPhoneOffer: SubscriptionModel;
  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private ofcService: OfcService,
    private bsService: BottomSheetService,
    private modalController: ModalController,
    private orangeMoneyService: OrangeMoneyService,
    private iab: InAppBrowser,
    private platform: Platform,
    private oemLoggingService: OemLoggingService
  ) {}

  ngOnInit() {
    this.imageUrl = this.service?.icone;
  }

  onClick() {
    const event = 'services' + this.service.code.toLowerCase() + '_click';
    this.oemLoggingService.registerEvent(event, []);
    if (!this.service.activated) {
      this.showServiceUnavailableToast();
      // this.service.clicked = !this.service.clicked;
      return;
    }
    if (this.service.passUsage) {
      this.bsService.openNumberSelectionBottomSheet(NumberSelectionOption.WITH_MY_PHONES, OPERATION_TYPE_PASS_USAGE, 'list-pass-usage', this.service);
      return;
    }
    if (this.service.code + '' === ServiceCode.OFC) {
      this.ofcService.loadOFC();
      return;
    }
    this.bsService.opXtras.billData = { company: this.service };
    if (this.service.code === OPERATION_TYPE_MERCHANT_PAYMENT) {
      this.openMerchantBS();
      return;
    }
    if (this.service?.redirectionType === 'NAVIGATE' && this.service?.redirectionPath) {
      const isExternalUrl = isExternallURL(this.service?.redirectionPath);
      if (!isExternalUrl) {
        this.navCtrl.navigateForward([this.service.redirectionPath], {
          state: {
            purchaseType: this.service.code,
            ...{
              inputPhone: this.phone,
              //ligne: this.phone,
              clientCode: this.currentPhoneOffer?.clientCode,
              operationType: this.service.code,
              type: 'FIXE',
            },
          },
        });
      } else {
        const options: InAppBrowserOptions = this.platform.is('ios')
          ? {
              location: 'no',
              toolbar: 'yes',
              toolbarcolor: '#CCCCCC',
              toolbarposition: 'top',
              toolbartranslucent: 'no',
              closebuttoncolor: '#000000',
              closebuttoncaption: 'Fermer',
              hidespinner: 'yes',
            }
          : {};
        this.iab.create(this.service?.redirectionPath, '_blank', options);
      }
      this.oemLoggingService.registerEvent('offer_service_' + this.service?.code?.toLowerCase() + '_click');
    }
    if (this.service.code === OPERATION_WOYOFAL) {
      this.bsService.initBsModal(WoyofalSelectionComponent, OPERATION_WOYOFAL, BillAmountPage.ROUTE_PATH).subscribe(_ => {});
      this.bsService.openModal(WoyofalSelectionComponent);
      return;
    }
    if (this.bsService[this.service.redirectionType]) {
      const params = [NumberSelectionOption.WITH_MY_PHONES, this.service.code, this.service.redirectionPath];
      this.bsService[this.service.redirectionType](...params);
      return;
    }
    switch (this.service?.code) {
      case OPERATION_TYPE_SEDDO_BONUS:
      case OPERATION_TYPE_SEDDO_CREDIT:
        this.bsService.openNumberSelectionBottomSheet(NumberSelectionOption.NONE, this.service.code, 'purchase-set-amount');
        break;
      case OPERATION_CHECK_OM_ACCOUNT_STATUS:
        this.openOMStatus();
        break;
      case OPERATION_SHARE_THE_APP:
        this.bsService.defaulSharingSheet();
        break;
      case OPERATION_SHARE_THE_APP:
        this.bsService.openRattacheNumberModal();
        break;
      case OPERATION_RATTACH_NUMBER:
        this.bsService.openRattacheNumberModal();
        break;
      case INFOS_ABONNEMENT_FIXE:
        this.bsService.openInfosLigneFixe(this.phone, this.currentPhoneOffer);
        break;
      default:
        break;
    }
  }

  async openOMStatus() {
    const modal = await this.modalController.create({
      component: OmStatusVisualizationComponent,
      cssClass: 'select-recipient-modal',
    });
    return await modal.present();
  }

  onErrorImg() {
    this.imageUrl = 'assets/images/04-boutons-01-illustrations-01-acheter-credit-ou-pass.svg';
  }

  async showServiceUnavailableToast() {
    const toast = await this.toastController.create({
      header: 'Service indisponible',
      message: this.service.reasonDeactivation,
      duration: 3000,
      position: 'middle',
      color: 'medium',
    });
    toast.present();
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
}
