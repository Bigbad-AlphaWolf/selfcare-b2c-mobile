import { Component, OnInit } from '@angular/core';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { ModalController, NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
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
  OPERATION_TYPE_PASS_INTERNATIONAL,
  OPERATION_ABONNEMENT_WIDO,
} from 'src/shared';
import { CreditPassAmountPage } from '../pages/credit-pass-amount/credit-pass-amount.page';
import { OfferPlansService } from '../services/offer-plans-service/offer-plans.service';
import { PromoBoosterActive } from '../dashboard';
import { OfferPlanActive } from 'src/shared/models/offer-plan-active.model';
import { BottomSheetService } from '../services/bottom-sheet/bottom-sheet.service';
import { ListPassVoyagePage } from '../pages/list-pass-voyage/list-pass-voyage.page';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { throwError } from 'rxjs';

import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { catchError, tap } from 'rxjs/operators';
import { FavoritePassOemModel } from '../models/favorite-pass-oem.model';
import { FavorisService } from '../services/favoris/favoris.service';
import { OperationService } from '../services/oem-operation/operation.service';
import { OffreService } from '../models/offre-service.model';
import { OPERATION_TRANSFERT_ARGENT, OPERATION_TYPE_PASS_USAGE } from '../utils/operations.constants';
import { MerchantPaymentCodeComponent } from 'src/shared/merchant-payment-code/merchant-payment-code.component';
import { PurchaseSetAmountPage } from '../purchase-set-amount/purchase-set-amount.page';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { OperationRecapLogicService } from '../services/operation-recap-logic/operation-recap-logic.service';
import { OperationExtras } from '../models/operation-extras.model';
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
  passUsages: OffreService[] = [];
  omPhoneNumber: string;
  isProcessing: boolean;
  errorMsg: string;
  userInfos: SubscriptionModel;
  hasPromoPlanActive: OfferPlanActive = null;
  hasBoosterPromoActive: PromoBoosterActive = null;
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
    private offerPlanServ: OfferPlansService,
    private dashbServ: DashboardService,
    private bsService: BottomSheetService,
    private omService: OrangeMoneyService,
    private authService: AuthenticationService,
    private favService: FavorisService,
    private toastController: ToastController,
    private operationService: OperationService,
    private followAnalyticsService: FollowAnalyticsService,
    private operationRecapLogigService: OperationRecapLogicService
  ) {}

  ngOnInit() {
    if (history && history.state) {
      this.purchaseType = history.state.purchaseType;
    }
    if (this.purchaseType === 'TRANSFER') {
      this.pageTitle = 'Transférer argent ou crédit';
      this.hubCode = HUB_ACTIONS.TRANSFERT;
      this.getServices();
    } else if (this.purchaseType === 'BUY') {
      this.pageTitle = 'Acheter crédit ou pass';
      this.hubCode = HUB_ACTIONS.ACHAT;
      this.getServices();
    } else {
      this.navController.navigateBack('/dashboard');
    }
  }

  getServices() {
    this.loadingServices = true;
    this.servicesHasError = false;
    this.operationService.getServicesByFormule(this.hubCode, null, true).subscribe(
      res => {
        this.loadingServices = false;
        this.options = res.filter(option => !option.passUsage);
        this.passUsages = res.filter(option => option.passUsage);
        this.getUserActiveBonPlans();
        if (this.purchaseType === 'BUY') {
          this.getUserActiveBoosterPromo();
          this.getFavoritePass();
        }
        this.getUserInfos();
        const followEvent = this.purchaseType === 'TRANSFER' ? 'Get_hub_transfert_services_success' : 'Get_hub_achat_services_success';
        this.followAnalyticsService.registerEventFollow(followEvent, 'event', this.currentPhone);
      },
      err => {
        this.loadingServices = false;
        this.servicesHasError = true;
        const followError = this.purchaseType === 'TRANSFER' ? 'Get_hub_transfert_services_failed' : 'Get_hub_achat_services_failed';
        this.followAnalyticsService.registerEventFollow(followError, 'error', {
          msisdn: this.currentPhone,
          error: err.status,
        });
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
    const followEvent = (this.purchaseType === 'TRANSFER' ? 'Hub_transfert_clic_' : 'Hub_Achat_clic_') + opt.code.toLowerCase();
    this.followAnalyticsService.registerEventFollow(followEvent, 'event', 'clic');
    if (opt.passUsage) {
      if (opt.code === OPERATION_ABONNEMENT_WIDO) {
        this.goToListPassWido(OPERATION_ABONNEMENT_WIDO, 'list-pass-usage', opt);
      } else {
        this.bsService.openNumberSelectionBottomSheet(
          NumberSelectionOption.WITH_MY_PHONES,
          OPERATION_TYPE_PASS_USAGE,
          'list-pass-usage',
          false,
          opt
        );
        return;
      }
    }
    switch (opt.code) {
      case OPERATION_TRANSFERT_ARGENT:
        this.showBeneficiaryModal();
        break;
      case OPERATION_TYPE_SEDDO_CREDIT:
        this.bsService.openNumberSelectionBottomSheet(NumberSelectionOption.NONE, OPERATION_TYPE_SEDDO_CREDIT, 'purchase-set-amount');
        break;
      case OPERATION_TYPE_SEDDO_BONUS:
        this.bsService.openNumberSelectionBottomSheet(NumberSelectionOption.NONE, OPERATION_TYPE_SEDDO_BONUS, 'purchase-set-amount');
        break;
      case OPERATION_TYPE_RECHARGE_CREDIT:
        this.bsService.openNumberSelectionBottomSheet(
          NumberSelectionOption.WITH_MY_PHONES,
          OPERATION_TYPE_RECHARGE_CREDIT,
          CreditPassAmountPage.PATH
        );
        break;
      case OPERATION_TYPE_PASS_INTERNET:
        this.openModalPassNumberSelection(OPERATION_TYPE_PASS_INTERNET, 'list-pass');
        break;
      case OPERATION_TYPE_PASS_INTERNATIONAL:
        this.openModalPassNumberSelection(OPERATION_TYPE_PASS_INTERNATIONAL, 'list-pass-international');
        break;
      case OPERATION_TYPE_PASS_ILLIMIX:
        this.openModalPassNumberSelection(OPERATION_TYPE_PASS_ILLIMIX, 'list-pass');
        break;
      case OPERATION_TYPE_PASS_VOYAGE:
        this.openModalPassNumberSelection(OPERATION_TYPE_PASS_VOYAGE, ListPassVoyagePage.ROUTE_PATH);
        break;
      case OPERATION_TYPE_PASS_ALLO:
        this.openModalPassNumberSelection(OPERATION_TYPE_PASS_ALLO, 'list-pass');
        break;
      case OPERATION_TYPE_PASS_ILLIFLEX:
        this.openModalPassNumberSelection(OPERATION_TYPE_PASS_ILLIFLEX, 'illiflex-budget-configuration');
        break;
      case OPERATION_TYPE_MERCHANT_PAYMENT:
        this.openMerchantBS();
      default:
        if (opt.redirectionType === 'NAVIGATE' && opt?.redirectionPath)
          this.navController.navigateForward([opt.redirectionPath], {
            state: { purchaseType: opt.code },
          });
        break;
    }
  }

  goToListPassWido(operation: string, routePath: string, opt: OffreService) {
    const opInfos = {
      senderMsisdn: this.currentPhone,
      destinataire: this.currentPhone,
      purchaseType: operation,
      isLightMod: false,
      recipientMsisdn: this.currentPhone,
      serviceUsage: opt,
    };
    this.navController.navigateForward([routePath], {
      state: opInfos,
    });
  }

  openModalPassNumberSelection(operation: string, routePath: string) {
    this.bsService.openNumberSelectionBottomSheet(NumberSelectionOption.WITH_MY_PHONES, operation, routePath);
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
    return !service.activated && (!service.reasonDeactivation || service.reasonDeactivation === '');
  }

  openMerchantBS() {
    this.omService.omAccountSession().subscribe(async (omSession: any) => {
      const omSessionValid = omSession ? omSession.msisdn !== 'error' && omSession.hasApiKey && !omSession.loginExpired : null;
      if (omSessionValid) {
        this.bsService
          .initBsModal(MerchantPaymentCodeComponent, OPERATION_TYPE_MERCHANT_PAYMENT, PurchaseSetAmountPage.ROUTE_PATH)
          .subscribe(_ => {});
        this.bsService.openModal(MerchantPaymentCodeComponent, {
          omMsisdn: omSession.msisdn,
        });
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

  showBeneficiaryModal() {
    this.appRouting.goToSelectBeneficiaryPage();
  }

  getUserActiveBonPlans() {
    this.offerPlanServ.getUserTypeOfferPlans().subscribe((res: OfferPlanActive) => {
      this.hasPromoPlanActive = res;
    });
  }

  getUserActiveBoosterPromo() {
    this.dashbServ.getActivePromoBooster().subscribe((res: PromoBoosterActive) => {
      this.hasBoosterPromoActive = res;
    });
  }

  displayBadgeBoosterPromoInOptionsForCategory(boosterActive: PromoBoosterActive, opt: OffreService): boolean {
    let result: boolean;
    if (boosterActive)
      switch (opt.code) {
        case OPERATION_TYPE_RECHARGE_CREDIT:
          return !!boosterActive.promoRecharge;
        case OPERATION_TYPE_PASS_ILLIMIX:
          return !!boosterActive.promoPassIllimix;
        case OPERATION_TYPE_PASS_INTERNET:
          return !!boosterActive.promoPass;
        default:
          break;
      }
    return result;
  }

  displayBadgeOfferPlanForInOptionsCategory(offerPlan: OfferPlanActive, opt: OffreService): boolean {
    let result: boolean;
    if (offerPlan)
      switch (opt.code) {
        case OPERATION_TYPE_RECHARGE_CREDIT:
          return offerPlan.hasRecharge;
        case OPERATION_TYPE_PASS_ILLIMIX:
          return offerPlan.hasPassIllimix;
        case OPERATION_TYPE_PASS_INTERNET:
          return offerPlan.hasPassInternet;
        default:
          break;
      }
    return result;
  }

  getFavoritePass() {
    const hmac = this.authService.getHmac();
    return this.favService
      .getFavoritePass()
      .pipe(
        tap((res: any) => {
          this.favoritesPass = res;
        }),
        catchError(err => {
          return throwError(err);
        })
      )
      .subscribe();
  }

  choosePass(pass: any, opType: string) {
    this.followAnalyticsService.registerEventFollow('Select_favorite_pass_click', 'event', {
      recipient: this.currentPhone,
      pass: pass,
    });
    const opXtras: OperationExtras = {
      pass: { ...pass, isFavoritePass: true },
      recipientCodeFormule: this.userInfos.code,
      purchaseType: opType,
      recipientMsisdn: this.currentPhone,
    };
    this.operationRecapLogigService.initRecapInfos(opXtras);
    this.operationRecapLogigService.setPaymentMod();
  }

  getUserInfos() {
    this.authService.getSubscriptionForTiers(this.currentPhone).subscribe((res: SubscriptionModel) => {
      this.userInfos = res;
    });
  }
}
