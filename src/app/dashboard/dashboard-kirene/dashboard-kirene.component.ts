import { Component, OnInit } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';
import {
  getConsoByCategory,
  UserConsommations,
  USER_CONS_CATEGORY_CALL,
  formatCurrency,
  SargalSubscriptionModel,
  SARGAL_NOT_SUBSCRIBED,
  SARGAL_UNSUBSCRIPTION_ONGOING,
  dashboardOpened
} from '..';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { SargalService } from 'src/app/services/sargal-service/sargal.service';
import { getLastUpdatedDateTimeText } from 'src/shared';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-dashboard-kirene',
  templateUrl: './dashboard-kirene.component.html',
  styleUrls: ['./dashboard-kirene.component.scss']
})
export class DashboardKireneComponent implements OnInit {
  showPromoBarner = ls.get('banner');
  userConsoSummary: any = {};
  userCallConsoSummary: {
    globalCredit: number;
    balance: number;
    isHybrid: boolean;
  } = null;
  userConsommations = {};
  userConsommationsCategories = [];
  userInfos: any = {};
  globalCredit = '';
  isHyBride = false;
  error = false;
  dataLoaded = false;

  creditRechargement: number;
  canDoSOS = false;
  creditValidity;

  pictures = [
    { image: '/assets/images/banniere-promo-mob.png' },
    { image: '/assets/images/banniere-promo-fibre.png' }
  ];

  soldebonus: number;
  canTransferBonus: boolean;
  listBanniere: BannierePubModel[] = [];
  isBanniereLoaded: boolean;
  slideOpts = {
    speed: 400,
    slidesPerView: 1.5,
    slideShadows: true
  };
  userSargalData: SargalSubscriptionModel;
  sargalDataLoaded: boolean;
  sargalUnavailable: boolean;
  sargalLastUpdate: string;
  SARGAL_NOT_SUBSCRIBED = SARGAL_NOT_SUBSCRIBED;
  constructor(
    private dashbordServ: DashboardService,
    private router: Router,
    private authServ: AuthenticationService,
    private banniereServ: BanniereService,
    private sargalServ: SargalService,
    private followsAnalytics: FollowAnalyticsService
  ) {}

  ngOnInit() {
    // GET conso summary
    // GET call conso summary (1+6+9)
    this.getUserConsommations();
    this.getSargalPoints();
    this.banniereServ.setListBanniereByFormule();
    this.banniereServ
      .getStatusLoadingBanniere()
      .subscribe((status: boolean) => {
        this.isBanniereLoaded = status;
        if (this.isBanniereLoaded) {
          this.listBanniere = this.banniereServ.getListBanniereByFormule();
        }
      });
    dashboardOpened.subscribe(x => {
      this.getUserConsommations();
      this.getSargalPoints();
    });
  }

  getUserConsommations() {
    this.dataLoaded = false;
    this.error = false;
    this.dashbordServ.getUserConsoInfosByCode().subscribe(
      (res: any[]) => {
        if (res.length) {
          const appelConso = res.find(x => x.categorie === 'APPEL')
            .consommations;
          if (appelConso) {
            this.getValidityDates(appelConso);
          }
          this.userConsoSummary = getConsoByCategory(res);
          this.userConsommationsCategories = this.getTrioConsoUser(res);
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
      },
      (err: any) => {
        this.sargalDataLoaded = true;
        this.sargalUnavailable = true;
      }
    );
  }

  getSargalStatusNotSubscribed() {
    return SARGAL_NOT_SUBSCRIBED;
  }

  getSargalStatusUnsubscriptionOnGoing() {
    return SARGAL_UNSUBSCRIPTION_ONGOING;
  }

  goToSargalDashboard() {
    this.router.navigate(['/sargal-dashboard']);
  }

  makeSargalAction() {
    if (
      this.userSargalData &&
      this.userSargalData.status === SARGAL_NOT_SUBSCRIBED &&
      this.sargalDataLoaded
    ) {
      this.followsAnalytics.registerEventFollow(
        'Sargal-registration-page',
        'event',
        'clicked'
      );
      this.router.navigate(['/sargal-registration']);
    } else if (
      (this.userSargalData &&
        this.userSargalData.status !== SARGAL_UNSUBSCRIPTION_ONGOING) ||
      (!this.sargalUnavailable && this.sargalDataLoaded)
    ) {
      this.followsAnalytics.registerEventFollow(
        'Sargal-dashboard',
        'event',
        'clicked'
      );
      this.goToSargalDashboard();
    }
  }

  getTrioConsoUser(consoSummary: UserConsommations) {
    const result = [];
    consoSummary.forEach(x => {
      for (const cons of x.consommations) {
        if (result.length < 3) {
          result.push(cons);
        }
      }
    });
    return result;
  }

  logOut() {
    this.authServ.logout();
    this.router.navigate(['/']);
  }

  hidePromoBarner() {
    ls.set('banner', false);
    this.showPromoBarner = false;
    this.followsAnalytics.registerEventFollow(
      'Banner_close_dashboard',
      'event',
      'Mobile'
    );
  }

  computeUserConsoSummary(consoSummary: UserConsommations) {
    const callConsos = consoSummary[USER_CONS_CATEGORY_CALL];
    let globalCredit = 0;
    let balance = 0;
    let isHybrid = false;
    if (callConsos) {
      callConsos.forEach(x => {
        // goblal conso = Amout of code 1 + code 6
        if (x.code === 1 || x.code === 6 || x.code === 2) {
          if (x.code === 1) {
            this.creditRechargement = +x.montant;
          } else if (x.code === 2 || x.code === 6) {
            this.soldebonus += Number(x.montant);
          }
          globalCredit += Number(x.montant);
        } else if (x.code === 9) {
          balance = Number(x.montant);
          isHybrid = true;
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
      isHybrid
    };
  }

  showSoldeOM() {
    this.followsAnalytics.registerEventFollow(
      'Click_Voir_solde_OM_dashboard',
      'event',
      'clicked'
    );
    this.router.navigate(['activate-om']);
  }

  openSosCreditPage() {
    this.canDoSOS = this.creditRechargement < 489;
    if (this.canDoSOS) {
      this.router.navigate(['/buy-sos-credit-illimix']);
      this.followsAnalytics.registerEventFollow(
        'Recharge_dashboard',
        'event',
        'clicked'
      );
    }
  }

  getValidityDates(appelConso: any[]) {
    let longestDate = 0;
    appelConso.forEach(conso => {
      const dateDMY = conso.dateExpiration.substring(0, 10);
      const date = this.processDateDMY(dateDMY);
      if (date > longestDate) {
        longestDate = date;
        this.creditValidity = dateDMY;
      }
    });
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

  goToIllimixPage() {
    this.router.navigate(['/buy-pass-illimix']);
  }

  transferCreditOrPass() {
    if (!this.canDoSOS || this.canTransferBonus) {
      this.router.navigate(['/transfer/credit-bonus']);
      this.followsAnalytics.registerEventFollow(
        'Transfert_dashboard',
        'event',
        'clicked'
      );
    }
  }

  goToTransfertOM() {
    this.router.navigate(['/transfer/orange-money']);
    this.followsAnalytics.registerEventFollow(
      'Transfert_OM_dashboard',
      'event',
      'clicked'
    );
  }

  goBuyCredit() {
    this.router.navigate(['/buy-credit']);
    this.followsAnalytics.registerEventFollow(
      'Recharge_dashboard',
      'event',
      'clicked'
    );
  }
  goBuyPassInternet() {
    this.followsAnalytics.registerEventFollow(
      'Pass_internet_dashboard',
      'event',
      'clicked'
    );
    this.router.navigate(['/buy-pass-internet']);
  }

  onError(input: { el: HTMLElement; display: boolean }[]) {
    input.forEach((item: { el: HTMLElement; display: boolean }) => {
      item.el.style.display = item.display ? 'block' : 'none';
    });
  }
}
