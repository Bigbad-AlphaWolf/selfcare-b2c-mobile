import { Component, OnInit } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { BillsService } from 'src/app/services/bill-service/bills.service';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';
import { MAIL_URL, months, SubscriptionModel, WelcomeStatusModel, SargalStatusModel, getBanniereTitle, getBanniereDescription, OTHER_CATEGORIES, HUB_ACTIONS } from 'src/shared';
import { MatDialog } from '@angular/material/dialog';
import { WelcomePopupComponent } from 'src/shared/welcome-popup/welcome-popup.component';
import { AssistanceService } from '../services/assistance.service';
import { SargalService } from '../services/sargal-service/sargal.service';
import { KILIMANJARO_FORMULE } from '../dashboard';
import { NavController } from '@ionic/angular';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { catchError, map, tap } from 'rxjs/operators';
import { OperationService } from '../services/oem-operation/operation.service';
import { OffreService } from '../models/offre-service.model';
import { IMAGES_DIR_PATH } from '../utils/constants';
import { of, throwError } from 'rxjs';
import { UserConsoService } from '../services/user-cunsommation-service/user-conso.service';
import {
  CONSO_ACTE_INTERNET,
  CONSO_ACTE_SMS,
  CONSO_ACTE_VOIX,
  CONSO_POSTPAID_DASHBOARD_ITEMS_LIMIT,
  isCounterConsoActe,
  NewUserConsoModel,
} from '../services/user-cunsommation-service/user-conso-service.index';
import { OPERATION_TYPE_TERANGA_BILL } from '../utils/operations.constants';
import { ANALYTICS_PROVIDER, OemLoggingService } from '../services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from '../utils/utils';
const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'app-dashboard-postpaid',
  templateUrl: './dashboard-postpaid.page.html',
  styleUrls: ['./dashboard-postpaid.page.scss'],
})
export class DashboardPostpaidPage implements OnInit {
  months = months;
  showPromoBarner = true;
  userConsoSummary: any = {};
  userCallConsoSummary: {
    globalCredit: number;
    balance: number;
    isHybrid: boolean;
  } = null;
  bills;
  userConsommations: any;
  userConsommationsCategories = [];
  balance = 0;
  consumedAmount;
  consumedDataVolume;
  balanceIsAvailable = false;
  isHyBride = false;
  errorConso;
  errorBill;
  dataLoaded = false;
  isConnected = false;
  showHelbBtn = false;
  creditRechargement: number;
  canDoSOS = false;
  lastUpdateOM;
  lastTimeUpdateOM;
  lastUpdateConso;
  pictures = [{ image: '/assets/images/banniere-promo-mob.png' }, { image: '/assets/images/banniere-promo-fibre.png' }];
  sosEligible = true;
  listBanniere: BannierePubModel[] = [];
  isBanniereLoaded: boolean;
  slideOpts = {
    speed: 400,
    slidesPerView: 1.5,
    slideShadows: true,
  };
  userPhoneNumber: string;
  firstName: string;
  fabOpened = false;
  loadingStatus: boolean;
  sargalStatusUnavailable: boolean;
  noSargalProfil: boolean;
  hasError: boolean;
  isKilimanjaroPostpaid: boolean;
  operations: OffreService[];
  sargalStatus: string;
  userConsumations: NewUserConsoModel[];
  consoActeVoix = 0;
  consoActeInternet = '0 Ko';
  consoActeSms = 0;
  Math = Math;
  limit = CONSO_POSTPAID_DASHBOARD_ITEMS_LIMIT;
  currentSubscription: SubscriptionModel;
  constructor(
    private dashbordServ: DashboardService,
    private router: Router,
    private authServ: AuthenticationService,
    private billsService: BillsService,
    private shareDialog: MatDialog,
    private assistanceService: AssistanceService,
    private sargalServ: SargalService,
    private banniereServ: BanniereService,
    private navCtl: NavController,
    private omServ: OrangeMoneyService,
    private operationService: OperationService,
    private userConsoService: UserConsoService,
    private oemLoggingService: OemLoggingService
  ) {}

  ngOnInit() {
    this.getUserInfos();
    this.getWelcomeStatus();
    this.userPhoneNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.oemLoggingService.registerEvent('dashboard_displayed', [{ dataName: 'msisdn', dataValue: this.userPhoneNumber }], ANALYTICS_PROVIDER.ALL);
  }

  fetchPostpaidActions() {
    this.operationService
      .getServicesByFormule()
      .pipe(
        map(res => {
          res = res.filter(service => {
            const categories = service.categorieOffreServices.map(cat => cat.code);
            return !categories.includes(OTHER_CATEGORIES) && !categories.includes(HUB_ACTIONS.OFFRES_FIXES) && !categories.includes(HUB_ACTIONS.FIXES);
          });
          res = res.sort((r1, r2) => r1.ordre - r2.ordre);
          this.oemLoggingService.registerEvent(
            'dashboard_postpaid_get_services_success',
            convertObjectToLoggingPayload({
              msisdn: this.userPhoneNumber,
            })
          );
          const moreActionService: OffreService = {
            redirectionType: 'NAVIGATE',
            shortDescription: 'Autres',
            icone: `${IMAGES_DIR_PATH}/ic-more-dots@2x.png`,
            fullDescription: 'Services',
            redirectionPath: 'oem-services',
            activated: true,
            code: 'more_services',
          };
          const souxateOfferService: OffreService = {
            redirectionType: 'NAVIGATE',
            shortDescription: 'Gérer',
            icone: `04-boutons-01-illustrations-05-convertire-mes-points-sargal.svg`,
            fullDescription: 'Fibre, Adsl, Box',
            redirectionPath: 'fixes-services',
            activated: true,
            code: 'FIXES',
          };
          const response: OffreService[] = res.slice(0, 4);
          response.push(souxateOfferService);
          response.push(moreActionService);
          return response;
        }),
        tap(res => {
          this.operations = res;
        }),
        catchError((err: any) => {
          this.oemLoggingService.registerEvent(
            'dashboard_postpaid_get_services_error',
            convertObjectToLoggingPayload({
              msisdn: this.userPhoneNumber,
              error: err.status,
            })
          );
          return of(err);
        })
      )
      .subscribe();
  }

  ionViewWillEnter() {
    this.getConsoPostpaid();
    this.getBills();
    this.getCustomerSargalStatus();
    this.getCurrentSubscription();
    this.checkOMNumber();
    this.fetchPostpaidActions();
    this.banniereServ.setListBanniereByFormule();
    this.banniereServ.getListBanniereByFormuleByZone().subscribe((res: any) => {
      this.listBanniere = res;
    });
  }

  checkOMNumber() {
    this.omServ
      .getOmMsisdn()
      .pipe(
        map(omNumber => {
          if (omNumber !== 'error') {
            this.dashbordServ.swapOMCard();
          }
        })
      )
      .subscribe();
  }

  getCurrentSubscription() {
    this.userPhoneNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.authServ.getSubscription(this.userPhoneNumber).subscribe((subscription: SubscriptionModel) => {
      this.currentSubscription = subscription;
      this.isKilimanjaroPostpaid = subscription.code === KILIMANJARO_FORMULE;
    });
  }

  getCustomerSargalStatus() {
    this.loadingStatus = false;
    this.hasError = false;
    this.sargalStatusUnavailable = false;
    this.noSargalProfil = false;
    this.sargalServ.getCustomerSargalStatus().subscribe(
      (sargalStatus: SargalStatusModel) => {
        this.oemLoggingService.registerEvent('Affichage_profil_sargal_success', [
          {
            dataName: 'msisdn',
            dataValue: this.userPhoneNumber,
          },
        ]);
        if (!sargalStatus.valid) {
          this.sargalStatusUnavailable = true;
          this.oemLoggingService.removeUserAttribute('sargal_profil');
        } else {
          this.sargalStatus = sargalStatus.profilClient;
          this.oemLoggingService.setUserAttribute({
            keyAttribute: 'sargal_profil',
            valueAttribute: this.sargalStatus,
          });
        }
        this.loadingStatus = true;
        this.hasError = false;
      },
      (err: any) => {
        this.loadingStatus = true;
        if (err.status === 400) {
          this.noSargalProfil = true;
        } else {
          this.sargalStatusUnavailable = true;
        }
      }
    );
  }

  makeSargalAction() {
    this.oemLoggingService.registerEvent('dashboard_postpaid_sargal_status_card_clic');
    this.router.navigate(['/sargal-status-card']);
  }

  getUserInfos() {
    const user = ls.get('user');
    this.firstName = user.firstName;
  }

  isCounterConsoActe(counter: NewUserConsoModel) {
    return isCounterConsoActe(counter);
  }

  getConsoPostpaid() {
    this.errorConso = false;
    this.userConsoService
      .getUserCunsomation()
      .pipe(
        tap((userConsommation: NewUserConsoModel[]) => {
          this.oemLoggingService.registerEvent(
            'dashboard_postpaid_get_conso_success',
            convertObjectToLoggingPayload({
              msisdn: this.userPhoneNumber,
            })
          );
          this.userConsumations = userConsommation;
          const consoActeVoix = this.userConsumations.find(x => !!x.name.toLowerCase().match(CONSO_ACTE_VOIX)),
            consoActeInternet = this.userConsumations.find(x => !!x.name.toLowerCase().match(CONSO_ACTE_INTERNET)),
            consoActeSms = this.userConsumations.find(x => !!x.name.toLowerCase().match(CONSO_ACTE_SMS));
          this.consoActeVoix = consoActeVoix ? consoActeVoix.montantConsommeBrut : 0;
          this.consoActeInternet = consoActeInternet ? consoActeInternet.montantConsomme : '0 Ko';
          this.consoActeSms = consoActeSms ? consoActeSms.montantConsommeBrut : 0;
          this.getLastConsoUpdate();
          this.dataLoaded = true;
        }),
        catchError(err => {
          this.dataLoaded = true;
          this.errorConso = true;
          this.oemLoggingService.registerEvent(
            'dashboard_postpaid_get_conso_error',
            convertObjectToLoggingPayload({
              msisdn: this.userPhoneNumber,
              error: err.status,
            })
          );
          return throwError(err);
        })
      )
      .subscribe();
  }

  logOut() {
    this.authServ.logout();
    this.router.navigate(['/']);
  }

  hidePromoBarner() {
    this.showPromoBarner = false;
    this.oemLoggingService.registerEvent('Banner_close_dashboard');
  }

  getBills() {
    this.errorBill = false;
    this.authServ.getSubscription(this.userPhoneNumber).subscribe((client: SubscriptionModel) => {
      this.billsService.getFactureMobile(client.clientCode).subscribe(
        (res: any[]) => {
          this.bills = res;
          if (res?.length) {
            this.oemLoggingService.setUserAttribute({
              keyAttribute: 'statut_last_facture_postpaid',
              valueAttribute: this.bills[0]?.statutFacture === 'paid' ? 'PAYEE' : 'IMPAYEE',
            });
          }
        },
        () => {
          this.errorBill = true;
        }
      );
    });
  }

  downloadBill(bill: any) {
    this.billsService.downloadBill(bill);
  }
  mailToCustomerService() {
    window.open(MAIL_URL);
  }

  getLastConsoUpdate() {
    const date = new Date();
    const lastDate = `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    const lastDateTime = `${date.getHours()}h` + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    this.lastUpdateConso = `${lastDate} à ${lastDateTime}`;
  }

  goDetailsCom(number?: number) {
    this.router.navigate(['/details-conso']);
    number ? this.oemLoggingService.registerEvent('Voirs_details_dashboard') : this.oemLoggingService.registerEvent('Voirs_details_card_dashboard');
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

  getWelcomeStatus() {
    const number = this.dashbordServ.getMainPhoneNumber();
    this.dashbordServ.getAccountInfo(number).subscribe(
      (resp: any) => {
        ls.set('user', resp);
        if (!resp.tutoViewed) {
          this.dashbordServ.getActivePromoBooster().subscribe((res: any) => {
            this.dashbordServ.getWelcomeStatus(res).subscribe(
              (res: WelcomeStatusModel) => {
                if (res.status === 'SUCCESS') {
                  this.showWelcomePopup(res);
                }
              },
              () => {}
            );
          });
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

  onVoirPlus() {
    this.oemLoggingService.registerEvent('dashboard_postpaid_voir_plus_clic');
    this.navCtl.navigateForward(['/oem-services']);
  }

  goBills() {
    this.oemLoggingService.registerEvent('dashboard_postpaid_voir_tout_facture');
    this.router.navigate(['/bills'], {
      state: {
        operationType: OPERATION_TYPE_TERANGA_BILL,
      },
    });
  }
}
