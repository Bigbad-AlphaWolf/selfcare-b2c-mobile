import { Component, OnInit, OnDestroy } from '@angular/core';

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
  WelcomeStatusModel
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
  PROFILE_TYPE_HYBRID_2
} from '../dashboard';
import { ShareSocialNetworkComponent } from 'src/shared/share-social-network/share-social-network.component';
import { MatDialog } from '@angular/material';
import { WelcomePopupComponent } from 'src/shared/welcome-popup/welcome-popup.component';
import { AssistanceService } from '../services/assistance.service';
const ls = new SecureLS({ encodingType: 'aes' });
@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard-prepaid-hybrid',
  templateUrl: './dashboard-prepaid-hybrid.page.html',
  styleUrls: ['./dashboard-prepaid-hybrid.page.scss']
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
    { image: '/assets/images/banniere-promo-fibre.png' }
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
  slideOpts = {
    speed: 400,
    slidesPerView: 1.5,
    slideShadows: true
  };
  CODE_COMPTEUR_VOLUME_NUIT_1 = CODE_COMPTEUR_VOLUME_NUIT_1;
  CODE_COMPTEUR_VOLUME_NUIT_2 = CODE_COMPTEUR_VOLUME_NUIT_2;
  CODE_COMPTEUR_VOLUME_NUIT_3 = CODE_COMPTEUR_VOLUME_NUIT_3;
  firstName: string;
  lastName: string;
  fabOpened = false;

  constructor(
    private dashbordServ: DashboardService,
    private router: Router,
    private authServ: AuthenticationService,
    private banniereServ: BanniereService,
    private sargalServ: SargalService,
    private followAnalyticsService: FollowAnalyticsService,
    private shareDialog: MatDialog,
    private assistanceService: AssistanceService
  ) {}

  ngOnInit() {
    this.getUserInfos();
    this.getWelcomeStatus();
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
    const currentNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.authServ.getSubscription(currentNumber).subscribe(
      (res: SubscriptionModel) => {
        this.currentProfil = res.profil;
        this.getActivePromoBooster(currentNumber, res.code);
        this.isHyBride =
          this.currentProfil === PROFILE_TYPE_HYBRID ||
          this.currentProfil === PROFILE_TYPE_HYBRID_1 ||
          this.currentProfil === PROFILE_TYPE_HYBRID_2;
      },
      (err: any) => {}
    );
  }

  getActivePromoBooster(msisdn: string, code: string) {
    this.dashbordServ
      .getActivePromoBooster(msisdn, code)
      .subscribe((res: any) => {
        this.hasPromoBooster = res;
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
            ? res.find(x => x.categorie === USER_CONS_CATEGORY_CALL)
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
      err => {
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

  makeSargalAction() {
    if (
      this.userSargalData &&
      this.userSargalData.status === SARGAL_NOT_SUBSCRIBED &&
      this.sargalDataLoaded
    ) {
      this.followAnalyticsService.registerEventFollow(
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
      this.followAnalyticsService.registerEventFollow(
        'Sargal-dashboard',
        'event',
        'clicked'
      );
      this.goToSargalDashboard();
    }
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
    const forfaitBalance = appelConso.find(x => x.code === 9);
    if (forfaitBalance) {
      this.balanceValidity = forfaitBalance.dateExpiration.substring(0, 10);
    }
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

  goToIllimixPage() {
    this.followAnalyticsService.registerEventFollow(
      'Pass_illimix_dashboard',
      'event',
      'clicked'
    );
    this.router.navigate(['/buy-pass-illimix']);
  }

  goToTransfertOM() {
    this.followAnalyticsService.registerEventFollow(
      'Transfert_OM_dashboard',
      'event',
      'clicked'
    );
    this.router.navigate(['/transfer/orange-money']);
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
      callConsos.forEach(x => {
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

  transferCreditOrPass() {
    // if (!this.canDoSOS || this.canTransferBonus) {
    this.followAnalyticsService.registerEventFollow(
      'Transfert_dashboard',
      'event',
      'clicked'
    );
    this.router.navigate(['/transfer/credit-bonus']);
    // }
  }

  showSoldeOM() {
    this.router.navigate(['activate-om']);
    this.followAnalyticsService.registerEventFollow(
      'Click_Voir_solde_OM_dashboard',
      'event',
      'clicked'
    );
  }

  goToSOSPage() {
    if (this.canDoSOS) {
      this.followAnalyticsService.registerEventFollow(
        'Recharge_dashboard',
        'event',
        'clicked'
      );
      this.router.navigate(['/buy-sos']);
    }
  }

  goBuyCredit() {
    this.followAnalyticsService.registerEventFollow(
      'Recharge_dashboard',
      'event',
      'clicked'
    );
    this.router.navigate(['/buy-credit']);
  }

  goBuyPassInternet() {
    this.followAnalyticsService.registerEventFollow(
      'Pass_internet_dashboard',
      'event',
      'clicked'
    );
    this.router.navigate(['/buy-pass-internet']);
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

  hidePromoBarner() {
    this.followAnalyticsService.registerEventFollow(
      'Banner_close_dashboard',
      'event',
      'Mobile'
    );
    this.showPromoBarner = false;
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
}
