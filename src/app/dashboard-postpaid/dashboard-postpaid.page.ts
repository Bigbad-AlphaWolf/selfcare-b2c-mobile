import { Component, OnInit } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { DashboardService, downloadAvatarEndpoint } from 'src/app/services/dashboard-service/dashboard.service';
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
  NO_AVATAR_ICON_URL
} from 'src/shared';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { PassVolumeDisplayPipe } from 'src/shared/pipes/pass-volume-display.pipe';
import { ShareSocialNetworkComponent } from 'src/shared/share-social-network/share-social-network.component';
import { MatDialog } from '@angular/material';
import { WelcomePopupComponent } from 'src/shared/welcome-popup/welcome-popup.component';
import { AssistanceService } from '../services/assistance.service';
import { SargalService } from '../services/sargal-service/sargal.service';
import { CODE_FORMULE_KILIMANJARO } from '../dashboard';
import { OperationOem } from '../models/operation.model';
import { ACTIONS_RAPIDES_OPERATIONS } from '../utils/operations.util';
const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'app-dashboard-postpaid',
  templateUrl: './dashboard-postpaid.page.html',
  styleUrls: ['./dashboard-postpaid.page.scss']
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
    { image: '/assets/images/banniere-promo-fibre.png' }
  ];
  sosEligible = true;
  listBanniere: BannierePubModel[] = [];
  isBanniereLoaded: boolean;
  slideOpts = {
    speed: 400,
    slidesPerView: 1.5,
    slideShadows: true
  };
  userPhoneNumber: string;
  firstName: string;
  fabOpened = false;
  loadingStatus: boolean;
  sargalStatusUnavailable: boolean;
  noSargalProfil: boolean;
  hasError: boolean;
  isKilimanjaroPostpaid: boolean;

  operations : OperationOem[] = ACTIONS_RAPIDES_OPERATIONS;
  avatarUrl : string = NO_AVATAR_ICON_URL;

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
    private banniereServ: BanniereService
  ) {}

  ngOnInit() {
    this.getUserInfos();
    this.getWelcomeStatus();
    this.userPhoneNumber = this.dashbordServ.getCurrentPhoneNumber();
  }

  ionViewWillEnter() {
    this.getConsoPostpaid();
    this.getBills();
    this.getCustomerSargalStatus();
    this.getCurrentSubscription();
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

  getCurrentSubscription() {
    this.userPhoneNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.authServ
      .getSubscription(this.userPhoneNumber)
      .subscribe((subscription: any) => {
        this.isKilimanjaroPostpaid =
          subscription.code === CODE_FORMULE_KILIMANJARO;
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

    if (user.imageProfil) 
      this.avatarUrl = downloadAvatarEndpoint + user.imageProfil;
   
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
        compteur: 'Solde Restant Voix',
        amount: consoVoix,
        percent: percentConsoVoix,
        total: totalVoix,
        unit: 'F'
      });
      conso.push({
        compteur: 'Restant Conso Internet',
        amount: formatConsoInt,
        percent: percentConsoInt,
        total: totalData,
        dataFinished: consoInt < 0
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
    this.authServ
      .getSubscription(this.userPhoneNumber)
      .subscribe((client: SubscriptionModel) => {
        this.billsService.getFactureMobile(client.clientCode).subscribe(
          res => {
            this.bills = res;
          },
          error => {
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

  fabToggled() {
    this.fabOpened = !this.fabOpened;
  }

  openSocialNetworkModal() {
    this.shareDialog.open(ShareSocialNetworkComponent, {
      height: '530px',
      width: '330px',
      maxWidth: '100%'
    });
  }

  onError(input: { el: HTMLElement; display: boolean }[]) {
    input.forEach((item: { el: HTMLElement; display: boolean }) => {
      item.el.style.display = item.display ? 'block' : 'none';
    });
  }

  showWelcomePopup(data: WelcomeStatusModel) {
    const dialog = this.shareDialog.open(WelcomePopupComponent, {
      data,
      panelClass: 'gift-popup-class'
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
            err => {}
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

  onOperation(){}
}
