import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import * as SecureLS from 'secure-ls';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { SargalService } from 'src/app/services/sargal-service/sargal.service';
import {
  getLastUpdatedDateTimeText,
  arrangeCompteurByOrdre,
  getTrioConsoUser,
  UserConsommations,
  formatCurrency,
  USER_CONS_CATEGORY_CALL,
  WelcomeStatusModel,
  SargalStatusModel,
  getBanniereTitle,
  getBanniereDescription,
  OPERATION_TYPE_MERCHANT_PAYMENT,
} from 'src/shared';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import {
  PROFILE_TYPE_PREPAID,
  SargalSubscriptionModel,
  PromoBoosterActive,
  CODE_COMPTEUR_VOLUME_NUIT_1,
  CODE_COMPTEUR_VOLUME_NUIT_2,
  CODE_COMPTEUR_VOLUME_NUIT_3,
  getConsoByCategory,
  SARGAL_NOT_SUBSCRIBED,
  SARGAL_UNSUBSCRIPTION_ONGOING,
  SubscriptionModel,
  PROFILE_TYPE_HYBRID,
  PROFILE_TYPE_HYBRID_1,
  PROFILE_TYPE_HYBRID_2,
  SARGAL_NOT_SUBSCRIBED_STATUS,
} from '../dashboard';
import { MatDialog } from '@angular/material';
import { WelcomePopupComponent } from 'src/shared/welcome-popup/welcome-popup.component';
import { AssistanceService } from '../services/assistance.service';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { MerchantPaymentCodeComponent } from 'src/shared/merchant-payment-code/merchant-payment-code.component';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { ModalController, NavController } from '@ionic/angular';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { OfferPlanActive } from 'src/shared/models/offer-plan-active.model';
import { OfferPlansService } from '../services/offer-plans-service/offer-plans.service';
import { BillsHubPage } from '../pages/bills-hub/bills-hub.page';
import { map } from 'rxjs/operators';
import { PurchaseSetAmountPage } from '../purchase-set-amount/purchase-set-amount.page';
import { BottomSheetService } from '../services/bottom-sheet/bottom-sheet.service';
import { OffresServicesPage } from '../pages/offres-services/offres-services.page';
import { OperationService } from '../services/oem-operation/operation.service';
import { OffreService } from '../models/offre-service.model';
import { BoosterModel } from '../models/booster.model';
const ls = new SecureLS({ encodingType: 'aes' });
@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-prepaid-hybrid',
  templateUrl: './dashboard-prepaid-hybrid.page.html',
  styleUrls: ['./dashboard-prepaid-hybrid.page.scss'],
})
export class DashboardPrepaidHybridPage implements OnInit, OnDestroy {
  opened = true;
  showPromoBarner = true;
  userConsoSummary: any = {};
  userCallConsoSummary: {
    globalCredit: number;
    balance: number;
    isHybrid: boolean;
  } = null;
  userConsommations = {};
  userConsommationsCategories = [];
  globalCredit = '';
  isHyBride = false;
  error = false;
  dataLoaded = false;
  creditRechargement = 0;
  canDoSOS = false;
  showHelbBtn = false;
  pictures = [
    { image: '/assets/images/banniere-promo-mob.png' },
    { image: '/assets/images/banniere-promo-fibre.png' },
  ];
  listBanniere: BannierePubModel[] = [];
  PROFILE_TYPE_PREPAID = PROFILE_TYPE_PREPAID;
  currentProfil: string;
  balanceValidity;
  creditValidity;
  soldebonus = 0;
  canTransferBonus: boolean;
  isBanniereLoaded: boolean;
  sargalLastUpdate;
  sargalUnavailable: boolean;
  sargalDataLoaded: boolean;
  userSargalData: SargalSubscriptionModel;
  hasPromoBooster: PromoBoosterActive = null;
  hasPromoPlanActive: OfferPlanActive = null;
  slideOpts = {
    speed: 400,
    slidesPerView: 1.38,
    slideShadows: true,
  };
  CODE_COMPTEUR_VOLUME_NUIT_1 = CODE_COMPTEUR_VOLUME_NUIT_1;
  CODE_COMPTEUR_VOLUME_NUIT_2 = CODE_COMPTEUR_VOLUME_NUIT_2;
  CODE_COMPTEUR_VOLUME_NUIT_3 = CODE_COMPTEUR_VOLUME_NUIT_3;
  firstName: string;
  lastName: string;
  fabOpened = false;
  isLoading: boolean;
  hasError: boolean;
  sargalStatusUnavailable: boolean;
  noSargalProfil: boolean;
  sargalStatus: string;
  showMerchantPay: boolean;
  currentMsisdn = this.dashbordServ.getCurrentPhoneNumber();

  constructor(
    private dashbordServ: DashboardService,
    private router: Router,
    private authServ: AuthenticationService,
    private banniereServ: BanniereService,
    private sargalServ: SargalService,
    private followAnalyticsService: FollowAnalyticsService,
    private shareDialog: MatDialog,
    private assistanceService: AssistanceService,
    private appliRouting: ApplicationRoutingService,
    private omServ: OrangeMoneyService,
    private modalController: ModalController,
    private offerPlanServ: OfferPlansService,
    private ref: ChangeDetectorRef,
    private bsService: BottomSheetService,
    private navCtrl: NavController,
    private operationService: OperationService
  ) {}

  ngOnInit() {
    this.getUserInfos();
  }

  checkMerchantPayment() {
    this.showMerchantPay = false;
    this.operationService
      .getServicesByFormule()
      .subscribe((allServices: OffreService[]) => {
        const merchantService = allServices.find(
          (service) => service.code === OPERATION_TYPE_MERCHANT_PAYMENT
        );
        if (merchantService) {
          this.showMerchantPay = merchantService.activated;
        }
      });
  }

  checkOMNumber() {
    this.omServ
      .getOmMsisdn()
      .pipe(
        map((omNumber) => {
          if (omNumber !== 'error') {
            this.dashbordServ.swapOMCard();
          }
        })
      )
      .subscribe();
  }

  getUserInfos() {
    const user = ls.get('user');
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }

  ngOnDestroy() {}

  ionViewWillEnter() {
    this.getCurrentSubscription();
    this.getUserConsommations();
    this.getSargalPoints();
    this.getUserActiveBonPlans();
    this.getActivePromoBooster();
    this.checkOMNumber();
    this.checkMerchantPayment();
    this.banniereServ.getListBanniereByFormuleByZone().subscribe((res: any) => {
      this.listBanniere = res;
    });
    this.getActiveServices();
  }

  getActiveServices() {
    this.operationService.getAllServices().subscribe((res: any) => {
      OperationService.AllOffers = res;
    });
  }

  getCustomerSargalStatus() {
    this.isLoading = true;
    this.hasError = false;
    this.sargalStatusUnavailable = false;
    this.noSargalProfil = false;
    this.sargalServ.getCustomerSargalStatus().subscribe(
      (sargalStatus: SargalStatusModel) => {
        this.followAnalyticsService.registerEventFollow(
          'Affichage_profil_sargal_success',
          'event',
          this.currentMsisdn
        );
        if (!sargalStatus.valid) {
          this.sargalStatusUnavailable = true;
        }
        this.sargalStatus = sargalStatus.profilClient;
        this.isLoading = false;
        this.hasError = false;
        this.ref.detectChanges();
      },
      (err: any) => {
        this.followAnalyticsService.registerEventFollow(
          'Affichage_profil_sargal_error',
          'error',
          { msisdn: this.currentMsisdn, error: err.status }
        );
        this.isLoading = false;
        if (err.status === 400) {
          this.noSargalProfil = true;
        } else {
          this.sargalStatusUnavailable = true;
        }
      }
    );
  }

  getCurrentSubscription() {
    const currentNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.authServ.getSubscription(currentNumber).subscribe(
      (res: SubscriptionModel) => {
        this.currentProfil = res.profil;
        this.isHyBride =
          this.currentProfil === PROFILE_TYPE_HYBRID ||
          this.currentProfil === PROFILE_TYPE_HYBRID_1 ||
          this.currentProfil === PROFILE_TYPE_HYBRID_2;
        if (this.isHyBride) {
          this.getCustomerSargalStatus();
        }
      },
      () => {}
    );
  }

  getActivePromoBooster() {
    this.dashbordServ.getActivePromoBooster().subscribe((res: any) => {
      this.hasPromoBooster = res;
      this.getWelcomeStatus(res);
    });
  }

  getUserConsommations() {
    this.dataLoaded = false;
    this.error = false;
    this.dashbordServ.getUserConsoInfosByCode().subscribe(
      (res: any) => {
        if (res.length) {
          res = arrangeCompteurByOrdre(res);
          const appelConso = res.length
            ? res.find((x) => x.categorie === USER_CONS_CATEGORY_CALL)
                .consommations
            : null;
          if (appelConso) {
            this.getValidityDates(appelConso);
          }
          this.userConsoSummary = getConsoByCategory(res);
          this.userConsommationsCategories = getTrioConsoUser(res);
          this.userCallConsoSummary = this.computeUserConsoSummary(
            this.userConsoSummary
          );
        } else {
          this.error = true;
        }
        this.dataLoaded = true;
      },
      () => {
        this.error = true;
        this.dataLoaded = true;
      }
    );
  }

  getSargalPoints() {
    this.sargalDataLoaded = false;
    this.sargalUnavailable = false;
    const currentNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.sargalServ.getSargalBalance(currentNumber).subscribe(
      (res: SargalSubscriptionModel) => {
        this.userSargalData = res;
        this.sargalLastUpdate = getLastUpdatedDateTimeText();
        this.sargalDataLoaded = true;
        this.followAnalyticsService.registerEventFollow(
          'Affichage_solde_sargal_success',
          'event',
          currentNumber
        );
      },
      (err) => {
        this.followAnalyticsService.registerEventFollow(
          'Affichage_solde_sargal_error',
          'error',
          { msisdn: currentNumber, error: err.status }
        );
        this.sargalDataLoaded = true;
        if (!this.userSargalData) {
          this.sargalUnavailable = true;
        }
      }
    );
  }

  getSargalStatusNotSubscribed() {
    return SARGAL_NOT_SUBSCRIBED;
  }

  getSargalStatusUnsubscriptionOnGoing() {
    return SARGAL_UNSUBSCRIPTION_ONGOING;
  }

  makeSargalAction(origin?: string) {
    if (
      this.userSargalData &&
      (this.userSargalData.status === SARGAL_NOT_SUBSCRIBED ||
        this.userSargalData.status === SARGAL_UNSUBSCRIPTION_ONGOING) &&
      this.sargalDataLoaded
    ) {
      this.followAnalyticsService.registerEventFollow(
        'Sargal_registration_card_clic',
        'event',
        'clicked'
      );
      this.router.navigate(['/sargal-registration']);
    } else if (!this.sargalUnavailable && this.sargalDataLoaded) {
      if (origin === 'card') {
        this.followAnalyticsService.registerEventFollow(
          'Sargal_dashboard_card_clic',
          'event',
          'clicked'
        );
      } else {
        this.followAnalyticsService.registerEventFollow(
          'Dashboard_Convertir_Sargal_clic',
          'event',
          'clicked'
        );
      }
      this.goToSargalDashboard();
    }
  }

  seeSargalCard() {
    this.followAnalyticsService.registerEventFollow(
      'Sargal_profil',
      'event',
      'clicked'
    );
    this.router.navigate(['/sargal-status-card']);
  }

  goToSargalDashboard() {
    this.router.navigate(['/sargal-dashboard']);
  }

  // process validity date of balance & credit to compare them
  processDateDMY(date: string) {
    const tab = date.split('/');
    const newDate = new Date(
      Number(tab[2]),
      Number(tab[1]) - 1,
      Number(tab[0])
    );
    return newDate.getTime();
  }

  // extract dates limit of balance & credit
  getValidityDates(appelConso: any[]) {
    const forfaitBalance = appelConso.find((x) => x.code === 9);
    if (forfaitBalance) {
      this.balanceValidity = forfaitBalance.dateExpiration.substring(0, 10);
    }
    let longestDate = 0;
    appelConso.forEach((conso) => {
      const dateDMY = conso.dateExpiration.substring(0, 10);
      const date = this.processDateDMY(dateDMY);
      if (date > longestDate) {
        longestDate = date;
        this.creditValidity = dateDMY;
      }
    });
  }

  hideMenu() {
    this.opened = false;
  }

  logOut() {
    this.authServ.logout();
    this.router.navigate(['/']);
  }

  computeUserConsoSummary(consoSummary: UserConsommations) {
    const callConsos = consoSummary[USER_CONS_CATEGORY_CALL];
    let globalCredit = 0;
    let balance = 0;
    let isHybrid = false;
    this.soldebonus = 0;
    this.creditRechargement = 0;
    if (callConsos) {
      callConsos.forEach((x) => {
        // goblal conso = Amout of code 1 + code 6
        if (x.code === 1 || x.code === 6 || x.code === 2) {
          if (x.code === 1) {
            this.creditRechargement += Number(x.montant);
          } else if (x.code === 2 || x.code === 6) {
            this.soldebonus += Number(x.montant);
          }
          globalCredit += Number(x.montant);
        } else if (x.code === 9) {
          balance = Number(x.montant);
          isHybrid = true;
          globalCredit += Number(x.montant);
        }
      });
      // Check if eligible for SOS
      this.canDoSOS = +this.creditRechargement < 489;
      // Check if eligible for bonus transfer
      this.canTransferBonus =
        this.creditRechargement > 20 && this.soldebonus > 1;
    }
    return {
      globalCredit: formatCurrency(globalCredit),
      balance: formatCurrency(balance),
      isHybrid,
    };
  }

  goToSOSPage() {
    if (this.canDoSOS) {
      this.followAnalyticsService.registerEventFollow(
        'Dashboard_sos_clic',
        'event',
        'clicked'
      );
      this.router.navigate(['/buy-sos']);
    }
  }

  goDetailsCom(number?: number) {
    this.router.navigate(['/details-conso']);
    number
      ? this.followAnalyticsService.registerEventFollow(
          'Voirs_details_dashboard',
          'event',
          'clicked'
        )
      : this.followAnalyticsService.registerEventFollow(
          'Voirs_details_card_dashboard',
          'event',
          'clicked'
        );
  }

  onError(input: { el: HTMLElement; display: boolean }[]) {
    input.forEach((item: { el: HTMLElement; display: boolean }) => {
      item.el.style.display = item.display ? 'block' : 'none';
    });
  }

  showWelcomePopup(data: WelcomeStatusModel) {
    const dialog = this.shareDialog.open(WelcomePopupComponent, {
      data,
      panelClass: 'gift-popup-class',
    });
    dialog.afterClosed().subscribe(() => {
      this.assistanceService.tutoViewed().subscribe(() => {});
    });
  }

  getWelcomeStatus(boosters) {
    const number = this.dashbordServ.getMainPhoneNumber();
    this.dashbordServ.getAccountInfo(number).subscribe(
      (resp: any) => {
        ls.set('user', resp);
        if (!resp.tutoViewed) {
          this.dashbordServ.getWelcomeStatus(boosters).subscribe(
            (res: WelcomeStatusModel) => {
              if (res.status === 'SUCCESS') {
                this.showWelcomePopup(res);
              }
            },
            () => {}
          );
        }
      },
      () => {}
    );
  }

  getBanniereTitle(description: string) {
    return getBanniereTitle(description);
  }

  getBanniereDescription(description: string) {
    return getBanniereDescription(description);
  }

  goToTransfertsPage() {
    this.followAnalyticsService.registerEventFollow(
      'Dashboard_hub_transfert_clic',
      'event',
      'clicked'
    );
    this.appliRouting.goToTransfertHubServicesPage('TRANSFER');
  }

  goToBuyPage() {
    this.followAnalyticsService.registerEventFollow(
      'Dashboard_hub_achat_clic',
      'event',
      'clicked'
    );
    this.appliRouting.goToTransfertHubServicesPage('BUY');
  }

  goMerchantPayment() {
    this.followAnalyticsService.registerEventFollow(
      'Dashboard_paiement_marchand_clic',
      'event'
    );
    this.omServ.omAccountSession().subscribe(async (omSession: any) => {
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
        this.bsService.openModal(MerchantPaymentCodeComponent, {
          omMsisdn: omSession.msisdn,
        });
      } else {
        this.openPinpad();
      }
    });
  }

  onPayerFacture() {
    this.followAnalyticsService.registerEventFollow(
      'Dashboard_hub_facture_clic',
      'event',
      'clicked'
    );
    this.router.navigate([BillsHubPage.ROUTE_PATH]);
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data && resp.data.success) {
        this.goMerchantPayment();
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

  onOffreClicked() {
    this.navCtrl.navigateForward(OffresServicesPage.ROUTE_PATH);
  }

  isNotSubscribedToSargal(status: string) {
    return SARGAL_NOT_SUBSCRIBED_STATUS.includes(status);
  }
}
