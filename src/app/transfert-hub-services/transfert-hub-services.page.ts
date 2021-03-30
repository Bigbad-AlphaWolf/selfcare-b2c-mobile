import { Component, OnInit } from '@angular/core';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import {
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { SelectBeneficiaryPopUpComponent } from './components/select-beneficiary-pop-up/select-beneficiary-pop-up.component';
import { NavigationExtras, Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { NumberSelectionComponent } from '../components/number-selection/number-selection.component';
import { NumberSelectionOption } from '../models/enums/number-selection-option.enum';
import {
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_PASS_ALLO,
  OPERATION_TYPE_PASS_VOYAGE,
  SubscriptionModel,
  OPERATION_TYPE_PASS_ILLIFLEX,
  HUB_ACTIONS,
  OPERATION_TYPE_SEDDO_BONUS,
  OPERATION_TYPE_SEDDO_CREDIT,
  OPERATION_TYPE_MERCHANT_PAYMENT,
} from 'src/shared';
import { CreditPassAmountPage } from '../pages/credit-pass-amount/credit-pass-amount.page';
import { OfferPlansService } from '../services/offer-plans-service/offer-plans.service';
import { PromoBoosterActive } from '../dashboard';
import { OfferPlanActive } from 'src/shared/models/offer-plan-active.model';
import { BottomSheetService } from '../services/bottom-sheet/bottom-sheet.service';
import { ListPassVoyagePage } from '../pages/list-pass-voyage/list-pass-voyage.page';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { tap } from 'rxjs/operators';
import { FavoritePassOemModel } from '../models/favorite-pass-oem.model';
import { FavorisService } from '../services/favoris/favoris.service';
import { OperationService } from '../services/oem-operation/operation.service';
import { OffreService } from '../models/offre-service.model';
import { OPERATION_TRANSFERT_ARGENT } from '../utils/operations.constants';
import { MerchantPaymentCodeComponent } from 'src/shared/merchant-payment-code/merchant-payment-code.component';
import { PurchaseSetAmountPage } from '../purchase-set-amount/purchase-set-amount.page';
@Component({
  selector: 'app-transfert-hub-services',
  templateUrl: './transfert-hub-services.page.html',
  styleUrls: ['./transfert-hub-services.page.scss'],
})
export class TransfertHubServicesPage implements OnInit {
  OPERATION_TYPE_PASS_ALLO = OPERATION_TYPE_PASS_ALLO;
  OPERATION_TYPE_PASS_INTERNET = OPERATION_TYPE_PASS_INTERNET;
  OPERATION_TYPE_PASS_ILLIMIX = OPERATION_TYPE_PASS_ILLIMIX;
  pageTitle: string;
  options: OffreService[] = [];
  omPhoneNumber: string;
  isProcessing: boolean;
  errorMsg: string;
  userInfos: SubscriptionModel;
  hasPromoPlanActive: OfferPlanActive = null;
  hasBoosterPromoActive: PromoBoosterActive = null;
  isLightMod: boolean; //boolean to tell if user is in connected or not connected mod
  currentPhone = this.dashbServ.getCurrentPhoneNumber();
  purchaseType: 'BUY' | 'TRANSFER';
  favoritesPass: FavoritePassOemModel;
  loadingServices: boolean;
  servicesHasError: boolean;
  hubCode: HUB_ACTIONS;
  constructor(
    private appRouting: ApplicationRoutingService,
    private modalController: ModalController,
    private navController: NavController,
    private router: Router,
    private offerPlanServ: OfferPlansService,
    private dashbServ: DashboardService,
    private bsService: BottomSheetService,
    private omService: OrangeMoneyService,
    private authService: AuthenticationService,
    private favService: FavorisService,
    private toastController: ToastController,
    private operationService: OperationService
  ) {}

  ngOnInit() {
    if (history && history.state) {
      this.purchaseType = history.state.purchaseType;
      this.isLightMod = history.state.isLightMod;
    }
    if (this.purchaseType === 'TRANSFER') {
      this.pageTitle = 'Transférer argent ou crédit';
      this.hubCode = HUB_ACTIONS.TRANSFERT;
    } else if (this.purchaseType === 'BUY') {
      this.pageTitle = 'Acheter crédit ou pass';
      this.hubCode = HUB_ACTIONS.ACHAT;
    } else {
      this.navController.navigateBack('/dashboard');
    }
    this.getServices();
  }

  getServices() {
    this.loadingServices = true;
    this.servicesHasError = false;
    this.operationService.getServicesByFormule(this.hubCode).subscribe(
      (res: any) => {
        this.loadingServices = false;
        console.log(res);

        this.options = res;
        this.getUserActiveBonPlans();
        this.getUserActiveBoosterPromo();
        this.getFavoritePass();
        this.getUserInfos();
      },
      (err) => {
        this.loadingServices = false;
        this.servicesHasError = true;
      }
    );
  }

  goBack() {
    this.navController.pop();
  }

  async goTo(opt: OffreService) {
    if (!opt.activated) {
      const toast = await this.toastController.create({
        header: 'Service indisponible',
        message: opt.reasonDeactivation,
        duration: 3000,
        position: 'middle',
        color: 'medium',
      });
      toast.present();
      return;
    }

    switch (opt.code) {
      case OPERATION_TRANSFERT_ARGENT:
        this.showBeneficiaryModal();
        break;
      case OPERATION_TYPE_SEDDO_CREDIT:
        this.appRouting.goToTransfertCreditPage();
        break;
      case OPERATION_TYPE_SEDDO_BONUS:
        this.appRouting.goToTransfertBonusPage();
        break;
      case OPERATION_TYPE_RECHARGE_CREDIT:
        this.bsService.openNumberSelectionBottomSheet(
          NumberSelectionOption.WITH_MY_PHONES,
          OPERATION_TYPE_RECHARGE_CREDIT,
          CreditPassAmountPage.PATH
        );
        break;
      case OPERATION_TYPE_PASS_INTERNET:
        this.openModalPassNumberSelection(
          OPERATION_TYPE_PASS_INTERNET,
          'list-pass'
        );
        break;
      case OPERATION_TYPE_PASS_ILLIMIX:
        this.openModalPassNumberSelection(
          OPERATION_TYPE_PASS_ILLIMIX,
          'list-pass'
        );
        break;
      case OPERATION_TYPE_PASS_VOYAGE:
        this.openModalPassNumberSelection(
          OPERATION_TYPE_PASS_VOYAGE,
          ListPassVoyagePage.ROUTE_PATH
        );
        break;
      case OPERATION_TYPE_PASS_ALLO:
        this.openModalPassNumberSelection(
          OPERATION_TYPE_PASS_ALLO,
          'list-pass'
        );
        break;
      case OPERATION_TYPE_PASS_ILLIFLEX:
        this.openModalPassNumberSelection(
          OPERATION_TYPE_PASS_ILLIFLEX,
          'illiflex-budget-configuration'
        );
        break;
      case OPERATION_TYPE_MERCHANT_PAYMENT:
        this.openMerchantBS();
      default:
        break;
    }
  }

  openModalPassNumberSelection(operation: string, routePath: string) {
    if (this.isLightMod) {
      this.authService
        .getSubscriptionForTiers(this.currentPhone)
        .subscribe((res: SubscriptionModel) => {
          const opInfos = {
            code: res.code,
            profil: res.profil,
            senderMsisdn: this.currentPhone,
            destinataire: this.currentPhone,
            purchaseType: operation,
            isLightMod: true,
            recipientMsisdn: this.currentPhone,
          };
          this.navController.navigateForward([routePath], {
            state: opInfos,
          });
        });
    } else {
      this.bsService.openNumberSelectionBottomSheet(
        NumberSelectionOption.WITH_MY_PHONES,
        operation,
        routePath,
        this.isLightMod
      );
    }
  }

  checkOmAccount() {
    this.omService.getOmMsisdn().subscribe((msisdn: string) => {
      if (msisdn !== 'error') {
        this.showBeneficiaryModal();
      } else {
        this.openPinpad();
      }
    });
  }

  isServiceHidden(service: OffreService) {
    return (
      !service.activated &&
      (!service.reasonDeactivation || service.reasonDeactivation === '')
    );
  }

  openMerchantBS() {
    this.omService.omAccountSession().subscribe(async (omSession: any) => {
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

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
    });
    return await modal.present();
  }

  async showBeneficiaryModal() {
    const modal = await this.modalController.create({
      component: SelectBeneficiaryPopUpComponent,
      cssClass: 'select-recipient-modal',
    });
    modal.onWillDismiss().then((response: any) => {
      if (response && response.data && response.data.recipientMsisdn) {
        const pageData = response.data;
        this.appRouting.goSetAmountPage(pageData);
      }
    });
    return await modal.present();
  }

  async openNumberSelectionBottomSheet(option?: NumberSelectionOption) {
    const modal = await this.modalController.create({
      component: NumberSelectionComponent,
      cssClass: 'modalRecipientSelection',
      componentProps: { option },
    });
    modal.onDidDismiss().then((response: any) => {
      let opInfos;
      if (response && response.data) {
        opInfos = response.data;
        if (!opInfos || !opInfos.recipientMsisdn) return;
        opInfos = { purchaseType: OPERATION_TYPE_RECHARGE_CREDIT, ...opInfos };
        this.router.navigate([CreditPassAmountPage.PATH], { state: opInfos });
      }
    });
    return await modal.present();
  }

  getUserActiveBonPlans() {
    this.offerPlanServ
      .getUserTypeOfferPlans()
      .subscribe((res: OfferPlanActive) => {
        this.hasPromoPlanActive = res;
      });
  }

  getUserActiveBoosterPromo() {
    this.dashbServ
      .getActivePromoBooster()
      .subscribe((res: PromoBoosterActive) => {
        this.hasBoosterPromoActive = res;
      });
  }

  displayBadgeBoosterPromoInOptionsForCategory(
    boosterActive: PromoBoosterActive,
    opt: {
      title: string;
      subtitle: string;
      icon: string;
      type:
        | 'TRANSFERT_MONEY'
        | 'TRANSFERT_CREDIT'
        | 'TRANSFERT_BONUS'
        | 'CREDIT'
        | 'PASS'
        | 'PASS_ILLIMIX'
        | 'PASS_VOYAGE'
        | 'PASS_INTERNATIONAL';
      url?: string;
      action?: 'REDIRECT' | 'POPUP';
    }
  ): boolean {
    let result: boolean;
    if (boosterActive)
      switch (opt.type) {
        case 'CREDIT':
          return boosterActive.promoRecharge;
        case 'PASS_ILLIMIX':
          return boosterActive.promoPassIllimix;
        case 'PASS':
          return boosterActive.promoPass;
        default:
          break;
      }
    return result;
  }

  displayBadgeOfferPlanForInOptionsCategory(
    offerPlan: OfferPlanActive,
    opt: {
      title: string;
      subtitle: string;
      icon: string;
      type:
        | 'TRANSFERT_MONEY'
        | 'TRANSFERT_CREDIT'
        | 'TRANSFERT_BONUS'
        | 'CREDIT'
        | 'PASS'
        | 'PASS_ILLIMIX'
        | 'PASS_VOYAGE'
        | 'PASS_INTERNATIONAL';
      url?: string;
      action?: 'REDIRECT' | 'POPUP';
    }
  ): boolean {
    let result: boolean;
    if (offerPlan)
      switch (opt.type) {
        case 'CREDIT':
          return offerPlan.hasRecharge;
        case 'PASS_ILLIMIX':
          return offerPlan.hasPassIllimix;
        case 'PASS':
          return offerPlan.hasPassInternet;
        default:
          break;
      }
    return result;
  }

  getFavoritePass() {
    const hmac = this.authService.getHmac();
    return this.favService
      .getFavoritePass(this.isLightMod, hmac)
      .pipe(
        tap((res: any) => {
          this.favoritesPass = res;
        })
      )
      .subscribe();
  }

  choosePass(pass: any, opType: string) {
    let navigationExtras: NavigationExtras = {
      state: {
        pass,
        recipientCodeFormule: this.userInfos.code,
        purchaseType: opType,
        recipientMsisdn: this.currentPhone,
        isLightMod: this.isLightMod,
      },
    };
    this.router.navigate(['/operation-recap'], navigationExtras);
  }

  getUserInfos() {
    this.authService
      .getSubscriptionForTiers(this.currentPhone)
      .subscribe((res: SubscriptionModel) => {
        this.userInfos = res;
      });
  }
}
