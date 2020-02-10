import { Component, OnInit } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { BillsService } from 'src/app/services/bill-service/bills.service';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';
import { formatDataVolume, MAIL_URL, months, SubscriptionModel } from 'src/shared';
import { dashboardOpened, dashboardMobilePostpaidOpened } from '..';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-dashboard-postpaid',
  templateUrl: './dashboard-postpaid.component.html',
  styleUrls: ['./dashboard-postpaid.component.scss']
})
export class DashboardPostpaidComponent implements OnInit {
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
  constructor(
    private dashbordServ: DashboardService,
    private router: Router,
    private authServ: AuthenticationService,
    private billsService: BillsService,
    private banniereServ: BanniereService,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.userPhoneNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.getConsoPostpaid();
    this.getBills();
    this.billsService.getBillsEmit().subscribe(res => {
      // this.loading = false;
      if (res === 'error') {
        this.errorBill = true;
      } else {
        this.bills = res;
      }
    });
    /* this.banniereServ.setListBanniereByFormule();
    this.banniereServ
      .getStatusLoadingBanniere()
      .subscribe((status: boolean) => {
        this.isBanniereLoaded = status;
        if (this.isBanniereLoaded) {
          this.listBanniere = this.banniereServ.getListBanniereByFormule();
        }
      });
 */
    dashboardMobilePostpaidOpened.subscribe(x => {
      this.getConsoPostpaid();
      this.getBills();
    });
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
      const totalVoix = userconsommations.iinitalAmount;
      let totalData = userconsommations.ivolumeInitialGprs;
      this.consumedAmount = userconsommations.iusedAmount;
      const conso = [];
      const consoVoix = userconsommations.iremainingAmount;
      const consoInt = totalData - userconsommations.iusedvolume;
      const percentConsoVoix = Math.round((consoVoix * 100) / totalVoix);
      const percentConsoInt = Math.round((consoInt * 100) / totalData);
      let formatConsoInt = formatDataVolume(consoInt);
      totalData = formatDataVolume(totalData).substring(0, 5);
      let consoDataTitle = 'Restant Conso Internet';
      if (consoInt < 0) {
        formatConsoInt = formatDataVolume(userconsommations.iusedvolume);
        consoDataTitle = 'Conso Internet';
      }
      conso.push({
        compteur: 'Solde Restant Voix',
        amount: consoVoix,
        percent: percentConsoVoix,
        total: totalVoix,
        unit: 'F'
      });
      conso.push({
        compteur: consoDataTitle,
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
    this.authServ.getSubscription(this.userPhoneNumber).subscribe((client: SubscriptionModel) => {
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
  onError(input: { el: HTMLElement; display: boolean }[]) {
    input.forEach((item: { el: HTMLElement; display: boolean }) => {
      item.el.style.display = item.display ? 'block' : 'none';
    });
  }
}
