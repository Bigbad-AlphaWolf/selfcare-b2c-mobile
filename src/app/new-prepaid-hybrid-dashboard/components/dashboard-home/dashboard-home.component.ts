import {
  Component,
  EventEmitter,
  NgZone,
  OnInit,
  Output,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  PromoBoosterActive,
  SargalSubscriptionModel,
  SARGAL_NOT_SUBSCRIBED,
  SARGAL_NOT_SUBSCRIBED_STATUS,
  SARGAL_UNSUBSCRIPTION_ONGOING,
} from 'src/app/dashboard';
import { ScrollVanishDirective } from 'src/app/directives/scroll-vanish/scroll-vanish.directive';
import { Story } from 'src/app/models/story-oem.model';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { BillsHubPage } from 'src/app/pages/bills-hub/bills-hub.page';
import { PurchaseSetAmountPage } from 'src/app/purchase-set-amount/purchase-set-amount.page';
import { ApplicationRoutingService } from 'src/app/services/application-routing/application-routing.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { SargalService } from 'src/app/services/sargal-service/sargal.service';
import { StoriesService } from 'src/app/services/stories-service/stories.service';
import { NewUserConsoModel } from 'src/app/services/user-cunsommation-service/user-conso-service.index';
import { UserConsoService } from 'src/app/services/user-cunsommation-service/user-conso.service';
import {
  formatCurrency,
  getLastUpdatedDateTimeText,
  isProfileHybrid,
  OPERATION_TYPE_MERCHANT_PAYMENT,
  SargalStatusModel,
  SubscriptionModel,
  WelcomeStatusModel,
} from 'src/shared';
import { MerchantPaymentCodeComponent } from 'src/shared/merchant-payment-code/merchant-payment-code.component';
import * as SecureLS from 'secure-ls';
import { OfferPlanActive } from 'src/shared/models/offer-plan-active.model';
import { WelcomePopupComponent } from 'src/shared/welcome-popup/welcome-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AssistanceService } from 'src/app/services/assistance.service';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit {
  @ViewChildren(ScrollVanishDirective) dir;
  @Output() seeDetails: EventEmitter<any> = new EventEmitter();
  slideOpts = {
    speed: 400,
    slidesPerView: 1.58,
    slideShadows: true,
  };
  actions = [
    {
      title: 'Acheter',
      subtitle: 'Crédit, pass',
      code: 'BUY',
      icon: '04-boutons-01-illustrations-01-acheter-credit-ou-pass.svg',
    },
    {
      title: 'Transférer',
      subtitle: 'Argent, crédit',
      code: 'TRANSFER',
      icon: '04-boutons-01-illustrations-02-transfert-argent-ou-credit.svg',
    },
    {
      title: 'Payer',
      subtitle: 'Ma facture',
      code: 'BILLS',
      icon: '04-boutons-01-illustrations-03-payer-ma-facture.svg',
    },
    {
      title: 'Payer',
      subtitle: 'un marchand',
      code: 'MERCHANT',
      icon: '04-boutons-01-illustrations-03-payer-ma-facture.svg',
    },
    {
      title: 'Convertir',
      subtitle: 'Points Sargal',
      code: 'SARGAL',
      icon: '04-boutons-01-illustrations-05-convertire-mes-points-sargal.svg',
    },
    {
      title: 'Demander',
      subtitle: 'un SOS',
      code: 'SOS',
      icon: '04-boutons-01-illustrations-06-demander-un-sos.svg',
    },
  ];
  currentMsisdn = this.dashboardService.getCurrentPhoneNumber();
  currentProfil: string;
  isHyBride: boolean;
  BUY_ACTION = 'BUY';
  loadingConso: boolean;
  consoHasError: boolean;
  creditRechargement;
  creditGlobal;
  creditValidity: string;

  loadingSargal: boolean;
  sargalLastUpdate: string;
  sargalUnavailable: boolean;
  userSargalData: SargalSubscriptionModel;

  hasSargalProfile: boolean;
  loadingSargalStatus: boolean;
  sargalStatusUnavailable: boolean;
  sargalStatus: string;

  canDoSOS: boolean;
  isIos: boolean;

  storiesByCategory: {
    categorie: {
      libelle?: string;
      ordre?: number;
      code?: string;
      zoneAffichage?: string;
    };
    stories: Story[];
    readAll: boolean;
  }[];
  isLoadingStories: boolean;
  hasError: boolean;
  hasPromoBooster: PromoBoosterActive = null;
  hasPromoPlanActive: OfferPlanActive = null;
  listBanniere: BannierePubModel[] = [];

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthenticationService,
    private router: Router,
    private followAnalyticsService: FollowAnalyticsService,
    private oemLogging: OemLoggingService,
    private consoService: UserConsoService,
    private sargalService: SargalService,
    private appliRouting: ApplicationRoutingService,
    private omService: OrangeMoneyService,
    private modalController: ModalController,
    private bsService: BottomSheetService,
    private zone: NgZone,
    private platform: Platform,
    private storiesService: StoriesService,
    private shareDialog: MatDialog,
    private assistanceService: AssistanceService,
    private banniereService: BanniereService,
    private firebaseAnalytics: FirebaseAnalytics
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.isIos = this.platform.is('ios');
    });
  }

  ionViewDidEnter() {
    this.zone.run(() => {
      console.log('force update the screen');
    });
  }

  ionViewWillEnter(event?) {
    this.getCurrentSubscription();
    this.getUserConsommations(event);
    // this.getUserActiveBonPlans();
    this.getActivePromoBooster();
    this.fetchUserStories();
    this.banniereService
      .getListBanniereByFormuleByZone()
      .subscribe((res: any) => {
        this.listBanniere = res;
      });
  }

  fetchUserStories() {
    this.isLoadingStories = true;
    this.storiesByCategory = [];
    this.hasError = false;
    this.storiesService
      .getCurrentStories()
      .pipe(
        tap((res: any) => {
          this.isLoadingStories = false;
          this.storiesByCategory =
            this.storiesService.groupeStoriesByCategory(res);
        }),
        catchError((err) => {
          this.isLoadingStories = false;
          this.hasError = true;
          return of(err);
        })
      )
      .subscribe();
  }

  getCurrentSubscription() {
    this.authService.getSubscription(this.currentMsisdn).subscribe(
      (res: SubscriptionModel) => {
        this.currentProfil = res.profil;
        this.isHyBride = isProfileHybrid(this.currentProfil);
        if (this.isHyBride) {
          this.getCustomerSargalStatus();
        } else {
          this.getSargalPoints();
        }
      },
      () => {}
    );
  }

  getSargalPoints() {
    this.loadingSargal = true;
    this.sargalUnavailable = false;
    const currentNumber = this.dashboardService.getCurrentPhoneNumber();
    this.sargalService.getSargalBalance(currentNumber).subscribe(
      (res: SargalSubscriptionModel) => {
        this.userSargalData = res;
        this.sargalLastUpdate = getLastUpdatedDateTimeText();
        this.loadingSargal = false;
        this.followAnalyticsService.registerEventFollow(
          'Affichage_solde_sargal_success',
          'event',
          currentNumber
        );
        this.oemLogging.registerEvent('Affichage_solde_sargal_success', [
          { dataName: 'currentNumber', dataValue: currentNumber },
        ]);
        this.oemLogging.setUserAttribute({
          keyAttribute: 'solde_sargal',
          valueAttribute: res.totalPoints,
        });
      },
      (err) => {
        this.followAnalyticsService.registerEventFollow(
          'Affichage_solde_sargal_error',
          'error',
          { msisdn: currentNumber, error: err.status }
        );
        this.oemLogging.registerEvent('Affichage_solde_sargal_error', [
          { dataName: 'msisdn', dataValue: currentNumber },
          { dataName: 'error', dataValue: err.status },
        ]);
        this.loadingSargal = false;
        if (!this.userSargalData) {
          this.sargalUnavailable = true;
        }
      }
    );
  }

  getUserConsommations(event?) {
    this.loadingConso = true;
    this.consoHasError = false;
    this.consoService
      .getUserCunsomation()
      .pipe(
        tap((conso) => {
          this.loadingConso = false;
          conso.length ? this.processConso(conso) : (this.consoHasError = true);
          event ? event.target.complete() : '';
        }),
        catchError((err) => {
          this.consoHasError = true;
          this.loadingConso = false;
          event ? event.target.complete() : '';
          return of(err);
        })
      )
      .subscribe();
  }

  processConso(consumation: NewUserConsoModel[]) {
    this.getValidityDates(consumation);
    const bonus1 = consumation.find((conso) => conso.codeCompteur === 2)
      ?.montantRestantBrut
      ? consumation.find((conso) => conso.codeCompteur === 2)
          ?.montantRestantBrut
      : 0;
    const bonus2 = consumation.find((conso) => conso.codeCompteur === 6)
      ?.montantRestantBrut
      ? consumation.find((conso) => conso.codeCompteur === 6)
          ?.montantRestantBrut
      : 0;
    const forfaitBalance = consumation.find((conso) => conso.codeCompteur === 9)
      ?.montantRestantBrut
      ? consumation.find((conso) => conso.codeCompteur === 9)
          ?.montantRestantBrut
      : 0;
    this.creditRechargement = consumation.find(
      (conso) => conso.codeCompteur === 1
    )?.montantRestantBrut;
    this.canDoSOS = this.creditRechargement <= 4;
    this.creditGlobal = formatCurrency(
      bonus1 + bonus2 + forfaitBalance + this.creditRechargement
    );
  }

  getValidityDates(appelConso: any[]) {
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

  processDateDMY(date: string) {
    const tab = date.split('/');
    const newDate = new Date(
      Number(tab[2]),
      Number(tab[1]) - 1,
      Number(tab[0])
    );
    return newDate.getTime();
  }

  getCustomerSargalStatus() {
    this.loadingSargalStatus = true;
    this.sargalStatusUnavailable = false;
    this.sargalService.getCustomerSargalStatus().subscribe(
      (sargalStatus: SargalStatusModel) => {
        this.hasSargalProfile = true;
        this.followAnalyticsService.registerEventFollow(
          'Affichage_profil_sargal_success',
          'event',
          this.currentMsisdn
        );
        if (!sargalStatus.valid) {
          this.sargalStatusUnavailable = true;
        }
        this.sargalStatus = sargalStatus.profilClient;
        this.loadingSargalStatus = false;
      },
      (err: any) => {
        this.followAnalyticsService.registerEventFollow(
          'Affichage_profil_sargal_error',
          'error',
          { msisdn: this.currentMsisdn, error: err.status }
        );
        this.loadingSargalStatus = false;
        if (err.status !== 400) {
          this.sargalStatusUnavailable = true;
        }
      }
    );
  }

  search() {
    this.dir.first.show();
  }

  isNotSubscribedToSargal(status: string) {
    return SARGAL_NOT_SUBSCRIBED_STATUS.includes(status);
  }

  seeSargalCard() {
    this.followAnalyticsService.registerEventFollow(
      'Sargal_profil',
      'event',
      'clicked'
    );
    this.router.navigate(['/sargal-status-card']);
  }

  consultConsoDetails(number?: number) {
    // this.router.navigate(['/details-conso']);
    this.seeDetails.emit();
    if (number) {
      this.followAnalyticsService.registerEventFollow(
        'Voirs_details_dashboard',
        'event',
        'clicked'
      );
      this.oemLogging.registerEvent('dashboard_conso_details_click', null);
    } else {
      this.followAnalyticsService.registerEventFollow(
        'Voirs_details_card_dashboard',
        'event',
        'clicked'
      );
      this.oemLogging.registerEvent('dashboard_conso_card_click', null);
    }
  }

  getActivePromoBooster() {
    this.dashboardService.getActivePromoBooster().subscribe((res: any) => {
      this.hasPromoBooster = res;
      this.getWelcomeStatus(res);
    });
  }

  getWelcomeStatus(boosters) {
    const number = this.dashboardService.getMainPhoneNumber();
    this.dashboardService.getAccountInfo(number).subscribe(
      (resp: any) => {
        ls.set('user', resp);
        if (!resp.tutoViewed) {
          this.dashboardService.getWelcomeStatus(boosters).subscribe(
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

  showWelcomePopup(data: WelcomeStatusModel) {
    const dialog = this.shareDialog.open(WelcomePopupComponent, {
      data,
      panelClass: 'gift-popup-class',
    });
    dialog.afterClosed().subscribe(() => {
      this.assistanceService.tutoViewed().subscribe(() => {});
    });
  }

  onSargalCardClicked(origin?: string) {
    this.firebaseAnalytics
      .logEvent('SARGAL_CARD_CLICKED', { msisdn: this.currentMsisdn })
      .then((res) => {
        console.log('ELEMENT_LOGGUE', res);
      });
    if (
      this.userSargalData &&
      (this.userSargalData.status === SARGAL_NOT_SUBSCRIBED ||
        this.userSargalData.status === SARGAL_UNSUBSCRIPTION_ONGOING) &&
      !this.loadingSargal
    ) {
      this.followAnalyticsService.registerEventFollow(
        'Sargal_registration_card_clic',
        'event',
        'clicked'
      );
      this.router.navigate(['/sargal-registration']);
    } else if (!this.sargalUnavailable && !this.loadingSargal) {
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
      this.router.navigate(['/sargal-dashboard']);
    }
  }

  onActionClick(action) {
    switch (action?.code) {
      case 'BUY':
        this.goToBuyPage();
        break;
      case 'TRANSFER':
        this.goToTransfertsPage();
        break;
      case 'BILLS':
        this.onPayerFacture();
        break;
      case 'MERCHANT':
        this.goMerchantPayment();
        break;
      case 'SARGAL':
        this.onSargalCardClicked();
        break;
      case 'SOS':
        this.goToSOSPage();
        break;
    }
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
    this.firebaseAnalytics
      .logEvent('Dashboard_hub_achat_clic', { msisdn: this.currentMsisdn })
      .then((res) => {
        console.log('ELEMENT_LOGGUE', res);
      });
    this.followAnalyticsService.registerEventFollow(
      'Dashboard_hub_achat_clic',
      'event',
      'clicked'
    );
    this.appliRouting.goToTransfertHubServicesPage('BUY');
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

  goMerchantPayment() {
    this.firebaseAnalytics
      .logEvent('Dashboard_paiement_marchand_clic', {
        msisdn: this.currentMsisdn,
      })
      .then((res) => {
        console.log('ELEMENT_LOGGUE', res);
      });
    this.followAnalyticsService.registerEventFollow(
      'Dashboard_paiement_marchand_clic',
      'event'
    );
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
        this.bsService.openModal(MerchantPaymentCodeComponent, {
          omMsisdn: omSession.msisdn,
        });
      } else {
        this.openPinpad();
      }
    });
  }

  onPayerFacture() {
    this.firebaseAnalytics
      .logEvent('Dashboard_paiement_factures_clic', {
        msisdn: this.currentMsisdn,
      })
      .then((res) => {
        console.log('ELEMENT_LOGGUE', res);
      });
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
}
