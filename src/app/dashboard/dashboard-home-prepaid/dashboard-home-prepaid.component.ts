import { Component, OnInit } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { PassInternetService } from 'src/app/services/pass-internet-service/pass-internet.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import {
  arrangeCompteurByOrdre,
  getTrioConsoUser,
  PAYMENT_MOD_CREDIT,
  formatDataVolume,
  UserConsommations,
  formatCurrency
} from 'src/shared';
import {
  USER_CONS_CATEGORY_CALL,
  USER_CONS_CATEGORY_INTERNET,
  getConsoByCategory,
  SubscriptionModel,
  CODE_COMPTEUR_VOLUME_NUIT_1,
  CODE_COMPTEUR_VOLUME_NUIT_2,
  CODE_COMPTEUR_VOLUME_NUIT_3,
  dashboardOpened
} from '..';
const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'app-dashboard-home-prepaid',
  templateUrl: './dashboard-home-prepaid.component.html',
  styleUrls: ['./dashboard-home-prepaid.component.scss']
})
export class DashboardHomePrepaidComponent implements OnInit {
  userConsoSummary: any = {};
  userCallConsoSummary: {
    globalCredit: number;
    consoData: string;
  } = null;
  userConsommations = {};
  userConsommationsCategories = [];
  globalCredit = '';
  creditValidity;
  internetValidity;
  error = false;
  src;
  slideOpts = {
    speed: 400,
    // slidesPerView: 1.5,
    slideShadows: true
  };
  pictures = [
    '/assets/images/banniere-promo-mob.png',
    '/assets/images/banniere-promo-fibre.png'
  ];
  showPromoBanner = ls.get('banner');
  listBanniere: BannierePubModel[] = [];
  listPass: any[] = [];
  loadingConso;
  errorOnLoadingConso;

  constructor(
    private passIntService: PassInternetService,
    private dashbdSrv: DashboardService,
    private router: Router,
    private followsAnalytics: FollowAnalyticsService,
    private authServ: AuthenticationService
  ) {}

  ngOnInit() {
    this.src = this.pictures[0];
    this.getConso();
    this.getPassInternetFixe();
    dashboardOpened.subscribe(x => {
      this.getConso();
      this.getPassInternetFixe();
    });
  }

  getConso() {
    this.loadingConso = true;
    this.errorOnLoadingConso = false;
    this.userCallConsoSummary = null;
    this.userConsommationsCategories = [];
    this.dashbdSrv.getUserConsoInfosByCode().subscribe(
      (res: any[]) => {
        // res = arrangeCompteurByOrdre(res);
        this.followsAnalytics.registerEventFollow(
          'dashboard_conso_fixe_prepaid',
          'event'
        );
        const orderedConso = arrangeCompteurByOrdre(res);
        const appelConso = orderedConso.length
          ? orderedConso.find(x => x.categorie === USER_CONS_CATEGORY_CALL)
              .consommations
          : null;
        const internetConso = orderedConso.length
          ? orderedConso.find(x => x.categorie === USER_CONS_CATEGORY_INTERNET)
            ? orderedConso.find(
                x => x.categorie === USER_CONS_CATEGORY_INTERNET
              ).consommations
            : null
          : null;
        if (appelConso) {
          this.creditValidity = this.getValidityDates(appelConso);
        }
        if (internetConso) {
          this.internetValidity = this.getValidityDates(internetConso);
        }
        this.userConsoSummary = getConsoByCategory(orderedConso);
        this.userConsommationsCategories = getTrioConsoUser(orderedConso);
        this.userCallConsoSummary = this.computeUserConsoSummary(
          this.userConsoSummary
        );
        this.loadingConso = false;
      },
      err => {
        this.loadingConso = false;
        this.errorOnLoadingConso = true;
      }
    );
  }

  getPassInternetFixe() {
    const userPhoneNumber = this.dashbdSrv.getCurrentPhoneNumber();
    this.authServ
      .getSubscription(userPhoneNumber)
      .subscribe((res: SubscriptionModel) => {
        if (res.code !== '0') {
          this.passIntService.setUserCodeFormule(res.code);
          this.passIntService.setPaymentMod(PAYMENT_MOD_CREDIT);
          this.passIntService.setListPassInternetOfUserByQuery();
          this.passIntService
            .getStatusPassLoaded()
            .subscribe((result: { status: boolean; error: boolean }) => {
              if (result.status) {
                if (!result.error) {
                  this.listPass = this.passIntService.getListPassInternetOfUser();
                }
              }
            });
        }
      });
  }

  computeUserConsoSummary(consoSummary: UserConsommations) {
    const callConsos = consoSummary[USER_CONS_CATEGORY_CALL];
    const internetConsos = consoSummary[USER_CONS_CATEGORY_INTERNET];
    let globalCredit = 0;
    let consoData = 0;
    if (callConsos) {
      callConsos.forEach(x => {
        // goblal conso = Amout of code 1 + code 6
        if (x.code === 1 || x.code === 6 || x.code === 2) {
          globalCredit += Number(x.montant);
        }
      });
    }
    if (internetConsos) {
      internetConsos.forEach(x => {
        if (
          x.code !== CODE_COMPTEUR_VOLUME_NUIT_1 &&
          x.code !== CODE_COMPTEUR_VOLUME_NUIT_2 &&
          x.code !== CODE_COMPTEUR_VOLUME_NUIT_3
        ) {
          consoData += x.montant;
        }
      });
    }

    return {
      globalCredit: formatCurrency(globalCredit),
      consoData: formatDataVolume(consoData)
    };
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

  // extract dates limit of balance & credit
  getValidityDates(appelConso: any[]) {
    let longestDate = 0;
    let validityDate;
    appelConso.forEach(conso => {
      const dateDMY = conso.dateExpiration.substring(0, 10);
      const date = this.processDateDMY(dateDMY);
      if (date > longestDate) {
        longestDate = date;
        validityDate = dateDMY;
      }
    });
    return validityDate;
  }

  hidePromoBarner() {
    this.followsAnalytics.registerEventFollow(
      'Banner_close_dashboard',
      'event',
      'Mobile'
    );
    ls.set('banner', false);
    this.showPromoBanner = false;
  }

  goDetailsCom(number?: number) {
    this.router.navigate(['/details-conso']);
    number
      ? this.followsAnalytics.registerEventFollow(
          'Voirs_details_dashboard',
          'event',
          'clicked'
        )
      : this.followsAnalytics.registerEventFollow(
          'Voirs_details_card_dashboard',
          'event',
          'clicked'
        );
  }

  selectPass(id: number) {
    this.followsAnalytics.registerEventFollow(
      'Pass_internet_dashboard_fix',
      'event',
      'clicked'
    );
    this.router.navigate([`/buy-pass-internet/${id}`]);
  }

  onError(input: { el: HTMLElement; display: boolean }[]) {
    input.forEach((item: { el: HTMLElement; display: boolean }) => {
      item.el.style.display = item.display ? 'block' : 'none';
    });
  }
}
