import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { WoyofalSelectionComponent } from 'src/app/components/counter/woyofal-selection/woyofal-selection.component';
import { KioskLocatorPopupComponent } from 'src/app/components/kiosk-locator-popup/kiosk-locator-popup.component';
import { NumberSelectionOption } from 'src/app/models/enums/number-selection-option.enum';
import { OffreService } from 'src/app/models/offre-service.model';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { BillAmountPage } from 'src/app/pages/bill-amount/bill-amount.page';
import { RapidoOperationPage } from 'src/app/pages/rapido-operation/rapido-operation.page';
import { PurchaseSetAmountPage } from 'src/app/purchase-set-amount/purchase-set-amount.page';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { FILE_DOWNLOAD_ENDPOINT } from 'src/app/services/utils/file.endpoints';
import { SelectBeneficiaryPopUpComponent } from 'src/app/transfert-hub-services/components/select-beneficiary-pop-up/select-beneficiary-pop-up.component';
import {
  OPERATION_RAPIDO,
  OPERATION_XEWEUL,
  OPERATION_TYPE_PASS_USAGE,
  OPERATION_WOYOFAL,
} from 'src/app/utils/operations.constants';
import {
  FIND_AGENCE_EXTERNAL_URL,
  CHECK_ELIGIBILITY_EXTERNAL_URL,
  OPERATION_INIT_CHANGE_PIN_OM,
  OPERATION_TYPE_MERCHANT_PAYMENT,
  OPERATION_RATTACH_NUMBER,
	OPERATION_UNBLOCK_OM_ACCOUNT,
	OPERATION_RESET_PIN_OM,
  OPERATION_TYPE_SEDDO_BONUS,
  OPERATION_TYPE_SEDDO_CREDIT,
} from 'src/shared';
import { MerchantPaymentCodeComponent } from '../merchant-payment-code/merchant-payment-code.component';
import { OmStatusVisualizationComponent } from '../om-status-visualization/om-status-visualization.component';
import {XeweulOperationPage} from '../../app/pages/xeweul-operation/xeweul-operation.page';
@Component({
  selector: 'app-action-item',
  templateUrl: './action-item.component.html',
  styleUrls: ['./action-item.component.scss'],
})
export class ActionItemComponent implements OnInit {
  @Input() action: OffreService;
  @Input() search: boolean = false;
  FILE_BASE_URL: string = FILE_DOWNLOAD_ENDPOINT;
  imageUrl: string;

  constructor(
    private router: Router,
    private followAnalyticsService: FollowAnalyticsService,
    private inAppBrowser: InAppBrowser,
    private modalController: ModalController,
    private dashbServ: DashboardService,
    private toastController: ToastController,
    private bsService: BottomSheetService,
    private orangeMoneyService: OrangeMoneyService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.imageUrl = this.action?.icone ? this.action.icone : null;
  }

  async showServiceUnavailableToast() {
    const toast = await this.toastController.create({
      header: 'Service indisponible',
      message: this.action.reasonDeactivation,
      duration: 3000,
      position: 'middle',
      color: 'medium',
    });
    toast.present();
  }

  openMerchantBS() {
    this.orangeMoneyService
      .omAccountSession()
      .subscribe(async (omSession: any) => {
        const omSessionValid = omSession
          ? omSession.msisdn !== 'error' &&
            omSession.hasApiKey &&
            !omSession.loginExpired
          : null;
        if (omSessionValid) {
          this.bsService
            .initBsModal(
              MerchantPaymentCodeComponent,
              OPERATION_TYPE_MERCHANT_PAYMENT,
              PurchaseSetAmountPage.ROUTE_PATH
            )
            .subscribe((_) => {});
          this.bsService.openModal(MerchantPaymentCodeComponent);
        } else {
          this.openPinpad();
        }
      });
  }

  doAction() {
    if (!this.action.activated) {
      this.showServiceUnavailableToast();
      // this.service.clicked = !this.service.clicked;
      return;
    }
    if (this.action.passUsage) {
      this.bsService.openNumberSelectionBottomSheet(
        NumberSelectionOption.WITH_MY_PHONES,
        OPERATION_TYPE_PASS_USAGE,
        'list-pass-usage',
        false,
        this.action
      );
      return;
    }
    this.bsService.opXtras.billData = { company: this.action };
    if (this.action.code === OPERATION_TYPE_MERCHANT_PAYMENT) {
      this.openMerchantBS();
      return;
    }
    if (this.action.redirectionType === 'NAVIGATE') {
      this.navController.navigateForward([this.action.redirectionPath], {
        state: { purchaseType: this.action.code },
      });
      return;
    }
    if (this.action.code === OPERATION_WOYOFAL) {
      this.bsService
        .initBsModal(
          WoyofalSelectionComponent,
          OPERATION_WOYOFAL,
          BillAmountPage.ROUTE_PATH
        )
        .subscribe((_) => {});
      this.bsService.openModal(WoyofalSelectionComponent);
      return;
    }
    if (this.bsService[this.action.redirectionType]) {
      const params = [
        NumberSelectionOption.WITH_MY_PHONES,
        this.action.code,
        this.action.redirectionPath,
      ];
      this.bsService[this.action.redirectionType](...params);
      return;
    }
    switch (this.action.code) {
      case OPERATION_TYPE_SEDDO_BONUS:
      case OPERATION_TYPE_SEDDO_CREDIT:
        this.bsService.openNumberSelectionBottomSheet(NumberSelectionOption.NONE, this.action.code, 'purchase-set-amount');
        break;
      case 'FIBRE_OPTIC':
        this.goFiberEligibility();
        break;
      case 'CODE_PUK':
        this.goPuk();
        break;
      case 'SET_INTERNET':
        this.goInternet();
        break;
      case 'SEDDO_CODE':
        this.goChangeSeddo();
        break;
      case 'SUIVI_DEMANDE':
        this.onFollowUpRequests();
        break;
      case 'DEPLAFONNEMENT':
        this.goDeplafonnementOldVersion();
        break;
      case 'DEPLAFONNEMENT_NEW':
        this.goDeplafonnement();
        break;
      case 'TRANSACTION_ERROR':
        this.goReclamation();
        break;
      case 'OUVERTURE_OM_ACCOUNT':
        this.goCreateOMAccountOldVersion();
        break;
      case 'OUVERTURE_OM_ACCOUNT_NEW':
        this.goCreateOMAccount();
        break;
      case 'SEARCH_AGENCY':
        this.goFindToAgenceWebSite();
        break;
      case 'CHANGE_PIN_OM':
        this.openPinpad();
        break;
      case 'IBOU_CONTACT':
        this.goIbouPage();
        break;
      case 'KIOSK_LOCATOR':
        this.openKioskLocatorModal();
        break;
      case 'BLOCK_TRANSFER':
        this.openBlockTransferModal();
        break;
      case 'OM_PLAFOND_INFOS':
        this.openOMStatus();
        break;
      case 'SHARE_THE_APP':
        this.bsService.defaulSharingSheet();
        break;
      case OPERATION_RATTACH_NUMBER:
        this.bsService.openRattacheNumberModal();
        break;
      case OPERATION_RAPIDO:
        this.navController.navigateForward(RapidoOperationPage.ROUTE_PATH);
        break;
      case OPERATION_XEWEUL:
        this.navController.navigateForward(XeweulOperationPage.ROUTE_PATH);
        break;
      case OPERATION_UNBLOCK_OM_ACCOUNT:
        this.goToUnblockOMAccount();
        break;
      case OPERATION_RESET_PIN_OM:
        this.goToResetOMAccount();
        break;
      default:
        if (this.action?.redirectionType === 'NAVIGATE') {
          this.followAnalyticsService.registerEventFollow('Offre_service_' + this.action?.code + '_clic', 'event');
          this.navController.navigateForward([this.action.redirectionPath], {
            state: { purchaseType: this.action?.code },
          });
        }
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

  async openKioskLocatorModal() {
    this.followAnalyticsService.registerEventFollow(
      'Kiosk_locator_clic',
      'event'
    );
    const modal = await this.modalController.create({
      component: KioskLocatorPopupComponent,
      cssClass: 'select-recipient-modal',
    });
    return await modal.present();
  }

  async openBlockTransferModal() {
    this.followAnalyticsService.registerEventFollow(
      'block_transfer_clic',
      'event'
    );
    const modal = await this.modalController.create({
      component: SelectBeneficiaryPopUpComponent,
      componentProps: {
        isForTransferBlocking: true,
      },
      cssClass: 'select-recipient-modal',
    });
    return await modal.present();
  }

  goIbouPage() {
    this.router.navigate(['/contact-ibou-hub']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_Hub_Ibou_card_clic',
      'event',
      'clicked'
    );
  }

  goToUnblockOMAccount() {
    this.router.navigate(['/om-self-operation/unblock-om-account']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_deblocage_compte_om_clic',
      'event',
      'clicked'
    );
  }

  goToResetOMAccount() {
    this.router.navigate(['/om-self-operation/unblock-om-account/reset-pin']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_reset_pin_compte_om_clic',
      'event',
      'clicked'
    );
  }

  goFiberEligibility() {
    this.inAppBrowser.create(CHECK_ELIGIBILITY_EXTERNAL_URL, '_self');
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_eligibilité_fibre_clic',
      'event',
      'clicked'
    );
  }

  goPuk() {
    this.router.navigate(['/control-center/puk']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_Find_PUK_clic',
      'event',
      'clicked'
    );
  }

  goChangeSeddo() {
    this.router.navigate(['/control-center/change-seddo-code']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_Change_Seddo_PIN_clic',
      'event',
      'clicked'
    );
  }

  goInternet() {
    this.router.navigate(['/control-center/internet-mobile']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_Parametrage_Internet_Mobile_clic',
      'event',
      'clicked'
    );
  }
  goCreateOMAccount() {
    this.router.navigate(['/om-self-operation/open-om-account']);
    // this.router.navigate(['/control-center/operation-om/creation-compte']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_New_Creation_Compte_OM_clic',
      'event',
      'clicked'
    );
  }

  goCreateOMAccountOldVersion() {
    this.router.navigate(['/control-center/operation-om/creation-compte']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_Creation_Compte_OM_clic',
      'event',
      'clicked'
    );
  }

  goDeplafonnement() {
    // this.router.navigate(['/control-center/operation-om/deplafonnement']);
    this.router.navigate(['/om-self-operation/deplafonnement']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_New_Deplafonnement_OM_clic',
      'event',
      'clicked'
    );
  }

  goDeplafonnementOldVersion() {
    this.router.navigate(['/control-center/operation-om/deplafonnement']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_Deplafonnement_OM_clic',
      'event',
      'clicked'
    );
  }

  goReclamation() {
    this.router.navigate(['/om-self-operation/cancel-transaction']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_Reclamation_OM_clic',
      'event',
      'clicked'
    );
  }

  onFollowUpRequests() {
    this.router.navigate(['follow-up-requests']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_suivi_demande-fixe_clic',
      'event',
      'clicked'
    );
  }

  goFindToAgenceWebSite() {
    this.inAppBrowser.create(FIND_AGENCE_EXTERNAL_URL, '_self');
    this.followAnalyticsService.registerEventFollow(
      'Assistance_hub_Trouver_agence_orange_clic',
      'event',
      'clicked'
    );
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: OPERATION_INIT_CHANGE_PIN_OM,
      },
    });
    this.followAnalyticsService.registerEventFollow(
      'Assistance_actions_change_pin_OM_clic',
      'event',
      'clicked'
    );
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data && resp.data.success) {
        const omUserInfos = resp.data.omUserInfos;
        this.dashbServ
          .getCustomerInformations()
          .pipe(
            tap((res: any) => {
              const birthDate = res.birthDate;
              if (birthDate) {
                const year = birthDate.split('-')[0];
                this.router.navigate(['/change-orange-money-pin'], {
                  state: { omUserInfos, birthYear: year },
                });
              }
            }),
            catchError((err: any) => {
              this.router.navigate(['/change-orange-money-pin'], {
                state: { omUserInfos },
              });
              return of(err);
            })
          )
          .subscribe();
      }
    });
    return await modal.present();
  }
}
