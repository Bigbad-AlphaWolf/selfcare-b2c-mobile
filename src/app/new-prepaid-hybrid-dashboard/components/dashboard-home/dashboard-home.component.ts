import { Component, EventEmitter, NgZone, OnInit, Output, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { of, timer } from 'rxjs';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';
import {
  PROFILE_TYPE_PREPAID,
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
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { SargalService } from 'src/app/services/sargal-service/sargal.service';
import { StoriesService } from 'src/app/services/stories-service/stories.service';
import { NewUserConsoModel } from 'src/app/services/user-cunsommation-service/user-conso-service.index';
import { UserConsoService, USER_CONSO_REQUEST_TIMEOUT, USER_CONSO_STORAGE_KEY } from 'src/app/services/user-cunsommation-service/user-conso.service';
import {
  formatCurrency,
  getLastUpdatedDateTimeText,
  HUB_ACTIONS,
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
import { ANALYTICS_PROVIDER, OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { QrScannerService } from 'src/app/services/qr-scanner-service/qr-scanner.service';
import { IlliflexService } from 'src/app/services/illiflex-service/illiflex.service';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { LocalStorageService } from 'src/app/services/localStorage-service/local-storage.service';
import { DemandeAnnulationTransfertModel } from 'src/app/models/demande-annulation-transfert.model';
import { TABS_SERVICES } from 'src/app/new-services/new-services.page';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';
const ls = new SecureLS({ encodingType: 'aes' });

enum TABS_DASHBOARD {
  HOME,
  CONSO,
  OM,
  SERVICES,
  ASSISTANCE,
}
interface Action {
  title: string;
  subtitle: string;
  code: string;
  icon: string;
}
@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit {
  @ViewChildren(ScrollVanishDirective) dir;
  @Output() seeDetails: EventEmitter<any> = new EventEmitter();
  @Output() goToSlide: EventEmitter<any> = new EventEmitter();
  slideOpts = {
    speed: 400,
    slidesPerView: 1.58,
    slideShadows: true,
  };
  actions: Action[] = [
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
      title: 'Gérer',
      subtitle: 'Fibre, Adsl, Box',
      code: 'FIXES',
      icon: '04-boutons-01-illustrations-05-convertire-mes-points-sargal.svg',
    },
    //{
    //  title: 'Convertir',
    //  subtitle: 'Points Sargal',
    //  code: 'SARGAL',
    //  icon: '04-boutons-01-illustrations-05-convertire-mes-points-sargal.svg',
    //},
    {
      title: 'Demander',
      subtitle: 'un SOS',
      code: 'SOS',
      icon: '04-boutons-01-illustrations-06-demander-un-sos.svg',
    },
  ];
  DEFAULT_LIST_ACTIONS = this.actions;
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
  PROFILE_TYPE_PREPAID = PROFILE_TYPE_PREPAID;

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
  listAnnulationTrx: DemandeAnnulationTransfertModel[] = [];
  isFechingListAnnulationTrx: boolean;
  constructor(
    private dashboardService: DashboardService,
    private authService: AuthenticationService,
    private router: Router,
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
    private qrScan: QrScannerService,
    private illiflexService: IlliflexService,
    private operationService: OperationService,
    private storageService: LocalStorageService,
    private bottomSheetService: BottomSheetService
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
    this.fetchOMMarchandLiteAnnulationTrx();
    this.banniereService.getListBanniereByFormuleByZone().subscribe((res: any) => {
      this.listBanniere = res;
    });
    this.illiflexService.getIlliflexPaliers().subscribe();
    this.preloadServices();
  }

  preloadServices() {
    this.operationService.getServicesByFormule().subscribe();
    this.operationService.getServicesByFormule(HUB_ACTIONS.TRANSFERT).subscribe();
    this.operationService.getServicesByFormule(HUB_ACTIONS.ACHAT).subscribe();
    this.operationService.getServicesByFormule(HUB_ACTIONS.OM).subscribe();
    this.operationService.getServicesByFormule(HUB_ACTIONS.FACTURES).subscribe();
    this.operationService.getServicesByFormule(null, true).subscribe();
    this.addNewHubSeDivertir();
  }

  addNewHubSeDivertir() {
    const hubSeDivertir: Action = {
      title: 'Se Divertir',
      subtitle: '',
      code: 'SE_DIVERTIR',
      icon: '04-boutons-01-illustrations-05-convertire-mes-points-sargal.svg',
    };
    this.actions = this.DEFAULT_LIST_ACTIONS;
    this.actions = this.actions.filter(elt => {
      if (isProfileHybrid) {
        return elt.code !== 'SOS';
      } else {
        return elt.code !== 'MERCHANT';
      }
    });
    this.actions.push(hubSeDivertir);
  }

  fetchOMMarchandLiteAnnulationTrx() {
    this.isFechingListAnnulationTrx = true;
    this.omService.getAnnulationTrxMarchandLite().subscribe(
      (res: any) => {
        this.isFechingListAnnulationTrx = false;
        this.listAnnulationTrx = res?.content?.data?.content;
      },
      err => {
        this.isFechingListAnnulationTrx = false;
      }
    );
  }

  async goToListAnnulationTrxMarchandLite() {
    const modal = await this.bottomSheetService.openListeAnnulationTrxForMLite(this.omService.mapToHistorikAchat(this.listAnnulationTrx));
    modal.present();
    modal.onDidDismiss().then((res: any) => {
      this.fetchOMMarchandLiteAnnulationTrx();
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
          this.storiesByCategory = this.storiesService.groupeStoriesByCategory(res);
        }),
        catchError(err => {
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
        this.getSargalPoints();
        this.getCustomerSargalStatus();
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
        this.oemLogging.registerEvent('Affichage_solde_sargal_success', [{ dataName: 'currentNumber', dataValue: currentNumber }]);
        this.oemLogging.setUserAttribute({
          keyAttribute: 'sargal_solde',
          valueAttribute: +res.totalPoints,
        });
        this.oemLogging.setUserAttribute({
          keyAttribute: 'sargal_statut',
          valueAttribute: !this.isNotSubscribedToSargal(this.userSargalData?.status),
        });
      },
      err => {
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
        finalize(() => {
          this.loadingConso = false;
          this.oemLogging.registerEvent('Dashboard_get_user_conso_success', [{ dataName: 'msisdn', dataValue: this.currentMsisdn }]);
        }),
        tap((conso: NewUserConsoModel[]) => {
          conso.length ? this.processConso(conso) : (this.consoHasError = true);
          event ? event.target.complete() : '';
        }),
        catchError(err => {
          this.consoHasError = true;
          event ? event.target.complete() : '';
          return of(err);
        })
      )
      .subscribe();
  }

  processConso(consumation: NewUserConsoModel[]) {
    const appelCompteur = consumation.filter(item => {
      return item.typeCompteur === 'APPEL';
    });
    this.getValidityDates(appelCompteur);
    const bonus1 = appelCompteur.find(conso => conso.codeCompteur === 2)?.montantRestantBrut ? appelCompteur.find(conso => conso.codeCompteur === 2)?.montantRestantBrut : 0;

    const bonus2 = appelCompteur.find(conso => conso.codeCompteur === 6)?.montantRestantBrut ? appelCompteur.find(conso => conso.codeCompteur === 6)?.montantRestantBrut : 0;

    const forfaitBalance = appelCompteur.find(conso => conso.codeCompteur === 9)?.montantRestantBrut
      ? appelCompteur.find(conso => conso.codeCompteur === 9)?.montantRestantBrut
      : 0;

    this.creditRechargement = appelCompteur.find(conso => conso.codeCompteur === 1)?.montantRestantBrut;
    this.canDoSOS = this.creditRechargement <= 4;
    this.creditGlobal = formatCurrency(bonus1 + bonus2 + forfaitBalance + this.creditRechargement);
    if (this.dashboardService.getCurrentPhoneNumber() === this.dashboardService.getMainPhoneNumber()) {
      this.oemLogging.setUserAttribute({
        keyAttribute: 'rechargement_solde',
        valueAttribute: +this.creditRechargement,
      });
    }
  }

  getValidityDates(appelConso: any[]) {
    let longestDate = 0;
    appelConso.forEach(conso => {
      const dateDMY = conso?.dateExpiration.substring(0, 10);
      const date = this.processDateDMY(dateDMY);
      if (date > longestDate) {
        longestDate = date;
        this.creditValidity = dateDMY;
      }
    });
  }

  processDateDMY(date: string) {
    const tab = date.split('/');
    const newDate = new Date(Number(tab[2]), Number(tab[1]) - 1, Number(tab[0]));
    return newDate.getTime();
  }

  getCustomerSargalStatus() {
    this.loadingSargalStatus = true;
    this.sargalStatusUnavailable = false;
    this.sargalService.getCustomerSargalStatus().subscribe(
      (sargalStatus: SargalStatusModel) => {
        this.hasSargalProfile = true;
        this.oemLogging.registerEvent('Affichage_profil_sargal_success', [
          {
            dataName: 'msisdn',
            dataValue: this.currentMsisdn,
          },
        ]);
        if (!sargalStatus.valid) {
          this.sargalStatusUnavailable = true;
          this.oemLogging.removeUserAttribute('sargal_profil');
        }
        this.sargalStatus = sargalStatus.profilClient;
        this.loadingSargalStatus = false;
        this.oemLogging.setUserAttribute({
          keyAttribute: 'sargal_profil',
          valueAttribute: this.sargalStatus,
        });
      },
      (err: any) => {
        this.oemLogging.registerEvent(
          'Affichage_profil_sargal_error',
          convertObjectToLoggingPayload({
            msisdn: this.currentMsisdn,
            error: err.status,
          })
        );
        this.loadingSargalStatus = false;
        if (err.status !== 400) {
          this.sargalStatusUnavailable = true;
        }
      }
    );
  }

  search() {
    this.oemLogging.registerEvent('dashboard_search_click', [{ dataName: 'msisdn', dataValue: this.currentMsisdn }]);
    this.dir.first.show();
  }

  isNotSubscribedToSargal(status: string) {
    return SARGAL_NOT_SUBSCRIBED_STATUS.includes(status);
  }

  seeSargalCard() {
    this.oemLogging.registerEvent('Sargal_profil');
    this.router.navigate(['/sargal-status-card']);
  }

  consultConsoDetails(number?: number) {
    // this.router.navigate(['/details-conso']);
    this.seeDetails.emit();
    if (number) {
      this.oemLogging.registerEvent('dashboard_conso_details_click', null, ANALYTICS_PROVIDER.FIREBASE_ANALYTICS);
    } else {
      this.oemLogging.registerEvent('dashboard_conso_card_click', null, ANALYTICS_PROVIDER.FIREBASE_ANALYTICS);
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
    this.oemLogging.registerEvent('dashboard_sargal_card_click', [{ dataName: 'msisdn', dataValue: this.currentMsisdn }]);
    if (this.userSargalData && (this.userSargalData.status === SARGAL_NOT_SUBSCRIBED || this.userSargalData.status === SARGAL_UNSUBSCRIPTION_ONGOING) && !this.loadingSargal) {
      this.oemLogging.registerEvent('Sargal_registration_card_clic', [{ dataName: 'msisdn', dataValue: this.currentMsisdn }]);
      this.router.navigate(['/sargal-registration']);
    } else if (!this.sargalUnavailable && !this.loadingSargal) {
      if (origin === 'card') {
        this.oemLogging.registerEvent('Sargal_dashboard_card_clic', [{ dataName: 'msisdn', dataValue: this.currentMsisdn }]);
      } else {
        this.oemLogging.registerEvent('Dashboard_Convertir_Sargal_clic', [{ dataName: 'msisdn', dataValue: this.currentMsisdn }]);
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
      case 'FIXES':
        this.goTAllFixeServices();
      case 'SE_DIVERTIR':
        this.goToNewServicesPage(TABS_SERVICES.LOISIR);
        break;
    }
  }

  goToTransfertsPage() {
    this.oemLogging.registerEvent('Dashboard_hub_transfert_clic', [{ dataName: 'msisdn', dataValue: this.currentMsisdn }]);
    this.appliRouting.goToTransfertHubServicesPage('TRANSFER');
  }

  goToBuyPage() {
    this.oemLogging.registerEvent('Dashboard_hub_achat_clic', [{ dataName: 'msisdn', dataValue: this.currentMsisdn }]);
    this.appliRouting.goToTransfertHubServicesPage('BUY');
  }

  goToSOSPage() {
    if (this.canDoSOS) {
      this.oemLogging.registerEvent('Dashboard_sos_clic', [{ dataName: 'msisdn', dataValue: this.currentMsisdn }]);
      this.router.navigate(['/buy-sos']);
    }
  }

  goTAllFixeServices() {
    this.oemLogging.registerEvent('gerer_mon_fixe_clic');
    this.router.navigate(['/fixes-services']);
  }

  goToNewServicesPage(tab: TABS_SERVICES) {
    this.oemLogging.registerEvent('se_divertir_clic');
    this.goToSlide.emit({
      slideTo: TABS_DASHBOARD.SERVICES,
      tab: tab,
    });
  }

  goMerchantPayment() {
    this.oemLogging.registerEvent('paiement_marchand_clic', [{ dataName: 'msisdn', dataValue: this.currentMsisdn }], ANALYTICS_PROVIDER.ALL);
    this.omService.omAccountSession().subscribe(async (omSession: any) => {
      const omSessionValid = omSession ? omSession.msisdn !== 'error' && omSession.hasApiKey && !omSession.loginExpired : null;
      if (omSessionValid) {
        this.bsService.initBsModal(MerchantPaymentCodeComponent, OPERATION_TYPE_MERCHANT_PAYMENT, PurchaseSetAmountPage.ROUTE_PATH).subscribe(_ => {});
        this.bsService.openModal(MerchantPaymentCodeComponent, {
          omMsisdn: omSession.msisdn,
        });
      } else {
        this.openPinpad();
      }
    });
  }

  onPayerFacture() {
    this.oemLogging.registerEvent('Dashboard_hub_facture_clic', [{ dataName: 'msisdn', dataValue: this.currentMsisdn }]);
    this.router.navigate([BillsHubPage.ROUTE_PATH]);
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
    });
    modal.onDidDismiss().then(resp => {
      if (resp && resp.data && resp.data.success) {
        this.goMerchantPayment();
      }
    });
    return await modal.present();
  }

  launchQrCode() {
    this.qrScan.startScan();
  }
}
