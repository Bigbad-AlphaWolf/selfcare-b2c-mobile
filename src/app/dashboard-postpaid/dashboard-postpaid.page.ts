import { Component, OnInit } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { BillsService } from 'src/app/services/bill-service/bills.service';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';
import {
  formatDataVolume,
  MAIL_URL,
  months,
  SubscriptionModel,
  WelcomeStatusModel,
  SargalStatusModel,
  getBanniereTitle,
  getBanniereDescription,
} from 'src/shared';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { PassVolumeDisplayPipe } from 'src/shared/pipes/pass-volume-display.pipe';
import { MatDialog } from '@angular/material';
import { WelcomePopupComponent } from 'src/shared/welcome-popup/welcome-popup.component';
import { AssistanceService } from '../services/assistance.service';
import { SargalService } from '../services/sargal-service/sargal.service';
import { KILIMANJARO_FORMULE } from '../dashboard';
import { OperationOem } from '../models/operation.model';
import { ACTIONS_RAPIDES_OPERATIONS_DASHBOARD } from '../utils/operations.util';
import { NavController } from '@ionic/angular';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { map } from 'rxjs/operators';
import { OperationService } from '../services/oem-operation/operation.service';
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
  pictures = [
    { image: '/assets/images/banniere-promo-mob.png' },
    { image: '/assets/images/banniere-promo-fibre.png' },
  ];
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
  operations: OperationOem[] = ACTIONS_RAPIDES_OPERATIONS_DASHBOARD;
  sargalStatus: string;
  constructor(
    private dashbordServ: DashboardService,
    private router: Router,
    private authServ: AuthenticationService,
    private billsService: BillsService,
    private followAnalyticsService: FollowAnalyticsService,
    private passVolumeDisplayPipe: PassVolumeDisplayPipe,
    private shareDialog: MatDialog,
    private assistanceService: AssistanceService,
    private sargalServ: SargalService,
    private banniereServ: BanniereService,
    private navCtl: NavController,
    private omServ: OrangeMoneyService,
    private operationService: OperationService
  ) {}

  ngOnInit() {
    this.getUserInfos();
    this.getWelcomeStatus();
    this.userPhoneNumber = this.dashbordServ.getCurrentPhoneNumber();
  }

  getActiveServices() {
    this.operationService.getAllServices().subscribe((res: any) => {
      OperationService.AllOffers = res;
    });
  }

  ionViewWillEnter() {
    this.getConsoPostpaid();
    this.getBills();
    this.getCustomerSargalStatus();
    this.getCurrentSubscription();
    this.checkOMNumber();
    this.banniereServ.setListBanniereByFormule();
    this.banniereServ
      .getStatusLoadingBanniere()
      .subscribe((status: boolean) => {
        this.isBanniereLoaded = status;
        if (this.isBanniereLoaded) {
          this.listBanniere = this.banniereServ.getListBanniereByFormule();
        }
      });
  }

  checkOMNumber() {
    this.omServ
      .getOmMsisdn()
      .pipe(
        map((omNumber) => {
          console.log(omNumber);
          if (omNumber !== 'error') {
            this.dashbordServ.swapOMCard();
          }
        })
      )
      .subscribe();
  }

  getCurrentSubscription() {
    this.userPhoneNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.authServ
      .getSubscription(this.userPhoneNumber)
      .subscribe((subscription: SubscriptionModel) => {
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
        if (!sargalStatus.valid) {
          this.sargalStatusUnavailable = true;
        }
        this.sargalStatus = sargalStatus.profilClient;
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
    this.router.navigate(['/sargal-status-card']);
  }

  getUserInfos() {
    const user = ls.get('user');
    this.firstName = user.firstName;
  }

  getConsoPostpaid() {
    this.errorConso = false;
    this.dashbordServ.getPostpaidUserConsoInfos().subscribe(
      (res: any) => {
        this.dataLoaded = true;
        this.userConsommations = this.computeUserConso(res);
        this.getLastConsoUpdate();
      },
      () => {
        this.dataLoaded = true;
        this.errorConso = true;
      }
    );
  }

  computeUserConso(userconsommations: any) {
    if (userconsommations) {
      const totalVoix =
        userconsommations.iinitalAmount + userconsommations.iusedAmount;
      let totalData =
        userconsommations.ivolumeInitialGprs + userconsommations.iusedvolume;
      this.consumedAmount = userconsommations.iusedAmount;
      this.consumedDataVolume = formatDataVolume(userconsommations.iusedvolume);
      const conso = [];
      const consoVoix = userconsommations.iinitalAmount;
      const consoInt = userconsommations.ivolumeInitialGprs;
      const percentConsoVoix = Math.round((consoVoix * 100) / totalVoix);
      const percentConsoInt = Math.round((consoInt * 100) / totalData);
      const formatConsoInt = this.passVolumeDisplayPipe.transform(
        formatDataVolume(consoInt)
      );
      totalData = this.passVolumeDisplayPipe.transform(
        formatDataVolume(totalData)
      );
      conso.push({
        compteur: 'Solde Restant Appels',
        amount: consoVoix,
        percent: percentConsoVoix,
        total: totalVoix,
        unit: 'F',
      });
      conso.push({
        compteur: 'Solde Restant Internet',
        amount: formatConsoInt,
        percent: percentConsoInt,
        total: totalData,
        dataFinished: consoInt < 0,
      });
      return conso;
    }
  }

  logOut() {
    this.authServ.logout();
    this.router.navigate(['/']);
  }

  hidePromoBarner() {
    this.showPromoBarner = false;
    this.followAnalyticsService.registerEventFollow(
      'Banner_close_dashboard',
      'event',
      'Mobile'
    );
  }

  getBills() {
    this.errorBill = false;
    this.authServ
      .getSubscription(this.userPhoneNumber)
      .subscribe((client: SubscriptionModel) => {
        this.billsService.getFactureMobile(client.clientCode).subscribe(
          (res) => {
            this.bills = res;
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
    const lastDate = `${('0' + date.getDate()).slice(-2)}/${(
      '0' +
      (date.getMonth() + 1)
    ).slice(-2)}/${date.getFullYear()}`;
    const lastDateTime =
      `${date.getHours()}h` +
      (date.getMinutes() < 10 ? '0' : '') +
      date.getMinutes();
    this.lastUpdateConso = `${lastDate} à ${lastDateTime}`;
  }

  goDetailsCom(number?: number) {
    this.router.navigate(['/details-conso']);
    number
      ? this.followAnalyticsService.registerEventFollow(
          'Voirs_details_dashboard',
          'event',
          'mobile'
        )
      : this.followAnalyticsService.registerEventFollow(
          'Voirs_details_card_dashboard',
          'event',
          'mobile'
        );
  }

  goToTransfertOM() {
    this.router.navigate(['/transfer/orange-money']);
    this.followAnalyticsService.registerEventFollow(
      'Transfert_OM_dashboard',
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

  getWelcomeStatus() {
    const number = this.dashbordServ.getMainPhoneNumber();
    this.dashbordServ.getAccountInfo(number).subscribe(
      (resp: any) => {
        ls.set('user', resp);
        if (!resp.tutoViewed) {
          this.dashbordServ.getWelcomeStatus().subscribe(
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

  onVoirPlus() {
    this.navCtl.navigateForward(['/oem-services']);
  }
}
