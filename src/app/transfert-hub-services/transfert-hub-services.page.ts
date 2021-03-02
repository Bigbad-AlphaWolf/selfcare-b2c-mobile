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
  PassInternetModel,
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

import { FacebookEventService } from '../services/facebook-event/facebook-event.service';
import { FacebookCustomEvent } from '../models/enums/facebook-custom-event.enum';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { PassInternetService } from '../services/pass-internet-service/pass-internet.service';
import { catchError, tap } from 'rxjs/operators';
import { FavoritePassOemModel } from '../models/favorite-pass-oem.model';
import { FavorisService } from '../services/favoris/favoris.service';
import { OperationService } from '../services/oem-operation/operation.service';
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
  transferOptions: {
    title: string;
    subtitle: string;
    icon: string;
    type: 'TRANSFERT_MONEY' | 'TRANSFERT_CREDIT' | 'TRANSFERT_BONUS';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }[] = [
    {
      title: 'Transfert',
      subtitle: "d'argent",
      icon:
        '/assets/images/04-boutons-01-illustrations-03-payer-ma-facture.svg',
      action: 'REDIRECT',
      type: 'TRANSFERT_MONEY',
      url: '',
    },
    {
      title: 'Transfert',
      subtitle: 'de crédit',
      icon:
        '/assets/images/04-boutons-01-illustrations-19-acheter-du-credit.svg',
      action: 'REDIRECT',
      type: 'TRANSFERT_CREDIT',
      url: '/transfer/credit-bonus',
    },
    {
      title: 'Transfert',
      subtitle: 'de bonus',
      icon:
        '/assets/images/04-boutons-01-illustrations-02-transfert-argent-ou-credit.svg',
      action: 'REDIRECT',
      type: 'TRANSFERT_BONUS',
      url: '/transfer/credit-bonus',
    },
  ];
  buyOptions: {
    title: string;
    subtitle: string;
    icon: string;
    type:
      | 'CREDIT'
      | 'PASS'
      | 'PASS_ILLIMIX'
      | 'PASS_VOYAGE'
      | 'PASS_INTERNATIONAL'
      | 'PASS_ALLO';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
    idCode?: number;
  }[] = [
    {
      title: 'Pass',
      subtitle: 'internet',
      icon:
        '/assets/images/04-boutons-01-illustrations-18-acheter-pass-internet.svg',
      action: 'REDIRECT',
      type: 'PASS',
      url: '',
    },
    {
      title: 'Pass',
      subtitle: 'illimix',
      icon:
        '/assets/images/04-boutons-01-illustrations-16-acheter-pass-illimix.svg',
      action: 'REDIRECT',
      type: 'PASS_ILLIMIX',
      url: '',
    },
    {
      title: 'Pass',
      subtitle: 'Allo',
      icon: '/assets/images/ic-call-forward@2x.png',
      action: 'REDIRECT',
      type: 'PASS_ALLO',
      url: '',
    },
    {
      title: 'Pass',
      subtitle: 'voyage',
      icon:
        '/assets/images/04-boutons-01-illustrations-09-acheter-pass-voyage.svg',
      action: 'REDIRECT',
      type: 'PASS_VOYAGE',
      url: '',
    },
  ];
  buyCreditOption: {
    title: string;
    subtitle: string;
    icon: string;
    type: 'CREDIT';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  } = {
    title: 'Recharge',
    subtitle: 'crédit',
    icon: '/assets/images/04-boutons-01-illustrations-19-acheter-du-credit.svg',
    action: 'REDIRECT',
    type: 'CREDIT',
    url: '',
  };
  buyIlliflexOption: {
    title: string;
    subtitle: string;
    icon: string;
    type;
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
    idCode?: number;
  } = {
    title: 'Pass',
    subtitle: 'illiflex',
    icon:
      '/assets/images/04-boutons-01-illustrations-16-acheter-pass-illimix.svg',
    action: 'REDIRECT',
    type: 'ILLIFLEX',
    url: '',
    idCode: 1134,
  };
  options: {
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
      | 'PASS_INTERNATIONAL'
      | 'PASS_ALLO'
      | 'ILLIFLEX';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }[] = [];
  omPhoneNumber: string;
  isProcessing: boolean;
  errorMsg: string;
  userInfos: SubscriptionModel;
  hasPromoPlanActive: OfferPlanActive = null;
  hasBoosterPromoActive: PromoBoosterActive = null;
  showNewFeatureBadge$: Observable<Boolean>;
  isLightMod: boolean; //boolean to tell if user is in connected or not connected mod
  currentPhone = this.dashbServ.getCurrentPhoneNumber();
  purchaseType: 'BUY' | 'TRANSFER';
  favoritesPass: FavoritePassOemModel;
  loadingServices: boolean;
  servicesHasError: boolean;
  allServices = [];
  constructor(
    private appRouting: ApplicationRoutingService,
    private modalController: ModalController,
    private navController: NavController,
    private router: Router,
    private offerPlanServ: OfferPlansService,
    private dashbServ: DashboardService,
    private bsService: BottomSheetService,
    private omService: OrangeMoneyService,
    private facebookevent: FacebookEventService,
    private authService: AuthenticationService,
    private favService: FavorisService,
    private toastController: ToastController,
    private operationService: OperationService
  ) {}

  ngOnInit() {
    this.getShowStatusNewFeatureAllo();
    if (history && history.state) {
      this.purchaseType = history.state.purchaseType;
      this.isLightMod = history.state.isLightMod;
      if (!this.isLightMod) {
        this.buyOptions.splice(0, 0, this.buyCreditOption);
      }
    }
    if (this.purchaseType === 'TRANSFER') {
      this.options = this.transferOptions;
      this.pageTitle = 'Transférer argent ou crédit';
    } else if (this.purchaseType === 'BUY') {
      this.pageTitle = 'Acheter crédit ou pass';
      this.getActiveServices();
    } else {
      this.navController.navigateBack('/dashboard');
    }
  }

  getActiveServices() {
    this.loadingServices = true;
    this.servicesHasError = false;
    this.operationService.getAllServices().subscribe(
      (res: any) => {
        this.loadingServices = false;
        this.options = this.buyOptions;
        this.getUserActiveBonPlans();
        this.getUserActiveBoosterPromo();
        this.getFavoritePass();
        this.getUserInfos();
        this.allServices = res;
        if (this.isServciceActivated(this.buyIlliflexOption))
          this.buyOptions.push(this.buyIlliflexOption);
      },
      (err) => {
        this.loadingServices = false;
        this.servicesHasError = true;
      }
    );
  }

  isServciceActivated(action) {
    const actionService = this.allServices.find(
      (service) => action.idCode && service.code === action.idCode
    );
    if (actionService) return actionService.activated;
    return true;
  }

  goBack() {
    this.navController.pop();
  }

  async goTo(opt: {
    title: string;
    subtitle: string;
    icon: string;
    type: string;
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
    idCode?: number;
  }) {
    if (!this.isServciceActivated(opt)) {
      const service = OperationService.AllOffers.find(
        (service) => opt.idCode && service.code === opt.idCode
      );
      const toast = await this.toastController.create({
        header: 'Service indisponible',
        message: service.reasonDeactivation,
        duration: 3000,
        position: 'middle',
        color: 'medium',
      });
      toast.present();
      return;
    }

    switch (opt.type) {
      case 'TRANSFERT_MONEY':
        if (opt.action === 'REDIRECT') {
          this.showBeneficiaryModal();
        }
        break;
      case 'TRANSFERT_CREDIT':
        if (opt.action === 'REDIRECT') {
          this.appRouting.goToTransfertCreditPage();
        }
        break;
      case 'TRANSFERT_BONUS':
        if (opt.action === 'REDIRECT') {
          this.appRouting.goToTransfertBonusPage();
        }
        break;
      case 'CREDIT':
        if (opt.action === 'REDIRECT') {
          this.bsService.openNumberSelectionBottomSheet(
            NumberSelectionOption.WITH_MY_PHONES,
            OPERATION_TYPE_RECHARGE_CREDIT,
            CreditPassAmountPage.PATH
          );
        }
        break;
      case 'PASS':
        if (opt.action === 'REDIRECT') {
          this.openModalPassNumberSelection(
            OPERATION_TYPE_PASS_INTERNET,
            'list-pass'
          );
        }
        break;
      case 'PASS_ILLIMIX':
        if (opt.action === 'REDIRECT') {
          this.openModalPassNumberSelection(
            OPERATION_TYPE_PASS_ILLIMIX,
            'list-pass'
          );
        }
        break;
      case 'PASS_VOYAGE':
        if (opt.action === 'REDIRECT') {
          this.openModalPassNumberSelection(
            OPERATION_TYPE_PASS_VOYAGE,
            ListPassVoyagePage.ROUTE_PATH
          );
        }
        break;
      case 'PASS_ALLO':
        if (opt.action === 'REDIRECT') {
          this.openModalPassNumberSelection(
            OPERATION_TYPE_PASS_ALLO,
            'list-pass'
          );
        }
        break;
      case 'ILLIFLEX':
        this.openModalPassNumberSelection(
          OPERATION_TYPE_PASS_ILLIFLEX,
          'illiflex-budget-configuration'
        );
        break;
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

  getShowStatusNewFeatureAllo() {
    this.showNewFeatureBadge$ = this.dashbServ.getNewFeatureAlloBadgeStatus();
  }

  getFavoritePass() {
    return this.favService
      .getFavoritePass()
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
      .getSubscription(this.currentPhone)
      .subscribe((res: SubscriptionModel) => {
        this.userInfos = res;
      });
  }
}
