import { Component, OnInit } from '@angular/core';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { ModalController, NavController } from '@ionic/angular';
import { SelectBeneficiaryPopUpComponent } from './components/select-beneficiary-pop-up/select-beneficiary-pop-up.component';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { NumberSelectionComponent } from '../components/number-selection/number-selection.component';
import { NumberSelectionOption } from '../models/enums/number-selection-option.enum';
import { OperationExtras } from '../models/operation-extras.model';
import {
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_PASS_ALLO,
  OPERATION_TYPE_PASS_VOYAGE
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
import { FacebookEvent } from '../models/enums/facebook-event.enum';
import { FacebookCustomEvent } from '../models/enums/facebook-custom-event.enum';
@Component({
  selector: 'app-transfert-hub-services',
  templateUrl: './transfert-hub-services.page.html',
  styleUrls: ['./transfert-hub-services.page.scss'],
})
export class TransfertHubServicesPage implements OnInit {
  OPERATION_TYPE_PASS_ALLO = OPERATION_TYPE_PASS_ALLO;
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
      icon: '/assets/images/icOrangeMoney.png',
      action: 'REDIRECT',
      type: 'TRANSFERT_MONEY',
      url: '',
    },
    {
      title: 'Transfert',
      subtitle: 'de crédit',
      icon: '/assets/images/ic-top-up-mobile@2x.png',
      action: 'REDIRECT',
      type: 'TRANSFERT_CREDIT',
      url: '/transfer/credit-bonus',
    },
    {
      title: 'Transfert',
      subtitle: 'de bonus',
      icon: '/assets/images/ic-reward.png',
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
  }[] = [
    {
      title: 'Crédit',
      subtitle: 'recharge',
      icon: '/assets/images/ic-top-up-mobile@2x.png',
      action: 'REDIRECT',
      type: 'CREDIT',
      url: '',
    },
    {
      title: 'Pass',
      subtitle: 'internet',
      icon: '/assets/images/ic-internet-usage@2x.png',
      action: 'REDIRECT',
      type: 'PASS',
      url: '',
    },
    {
      title: 'Pass',
      subtitle: 'illimix',
      icon: '/assets/images/ic-package-services@2x.png',
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
      icon: '/assets/images/ic-aeroplane.png',
      action: 'REDIRECT',
      type: 'PASS_VOYAGE',
      url: '',
    },
    // {
    //   title: 'Pass',
    //   subtitle: 'international',
    //   icon: '/assets/images/ic-international.png',
    //   action: 'REDIRECT',
    //   type: 'PASS_INTERNATIONAL',
    //   url: '',
    // },
  ];
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
      | 'PASS_ALLO';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }[] = [];
  omPhoneNumber: string;
  isProcessing: boolean;
  errorMsg: string;
  dataPayload: any;
  hasPromoPlanActive: OfferPlanActive = null;
  hasBoosterPromoActive: PromoBoosterActive = null;
  showNewFeatureBadge$: Observable<Boolean>;

  constructor(
    private appRouting: ApplicationRoutingService,
    private modalController: ModalController,
    private navController: NavController,
    private router: Router,
    private offerPlanServ: OfferPlansService,
    private dashbServ: DashboardService,
    private bsService: BottomSheetService,
    private omService : OrangeMoneyService,
    private facebookevent : FacebookEventService
  ) {}

  ngOnInit() {
    let purchaseType;
    this.getShowStatusNewFeatureAllo();
    if (history && history.state) {
      purchaseType = history.state.purchaseType;
    }
    if (purchaseType === 'TRANSFER') {
      this.options = this.transferOptions;
      this.pageTitle = 'Transférer argent ou crédit';
    } else if (purchaseType === 'BUY') {
      this.options = this.buyOptions;
      this.pageTitle = 'Acheter crédit ou pass';
      this.getUserActiveBonPlans();
      this.getUserActiveBoosterPromo();
    } else {
      this.navController.navigateBack('/dashboard');
    }
  }

  goToDashboard() {
    this.navController.navigateBack('/dashboard');
  }

  goTo(opt: {
    title: string;
    subtitle: string;
    icon: string;
    type: string;
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }) {
    // this.facebookevent.fbEvent(FacebookEvent.ViewContent,{});
    this.facebookevent.fbCustomEvent(FacebookCustomEvent.TestEvent,{customField1:'customField1',customField2:51});
    
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
          this.bsService.openNumberSelectionBottomSheet(
            NumberSelectionOption.WITH_MY_PHONES,
            OPERATION_TYPE_PASS_INTERNET,
            'list-pass'
          );
        }
        break;
      case 'PASS_ILLIMIX':
        if (opt.action === 'REDIRECT') {
          this.bsService.openNumberSelectionBottomSheet(
            NumberSelectionOption.WITH_MY_PHONES,
            OPERATION_TYPE_PASS_ILLIMIX,
            'list-pass'
          );
        }
        break;
      case 'PASS_VOYAGE':
        if (opt.action === 'REDIRECT') {
          this.bsService.openNumberSelectionBottomSheet(
            NumberSelectionOption.WITH_MY_PHONES,
            OPERATION_TYPE_PASS_VOYAGE,
            ListPassVoyagePage.ROUTE_PATH
          );
        }
        break;
      case 'PASS_ALLO':
        if (opt.action === 'REDIRECT') {
          this.bsService.openNumberSelectionBottomSheet(
            NumberSelectionOption.WITH_MY_PHONES,
            OPERATION_TYPE_PASS_ALLO,
            'list-pass'
          );
          // this.appRouting.goToSelectRecepientPassIllimix();
        }
        break;
      default:
        break;
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
        // this.getOmPhoneNumberAndCheckrecipientHasOMAccount(this.dataPayload);
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
}
