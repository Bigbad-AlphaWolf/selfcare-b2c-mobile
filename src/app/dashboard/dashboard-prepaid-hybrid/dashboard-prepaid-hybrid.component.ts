import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import {
  PROFILE_TYPE_PREPAID,
  getConsoByCategory,
  UserConsommations,
  USER_CONS_CATEGORY_CALL,
  SargalSubscriptionModel,
  formatCurrency,
  CODE_COMPTEUR_VOLUME_NUIT_1,
  CODE_COMPTEUR_VOLUME_NUIT_2,
  CODE_COMPTEUR_VOLUME_NUIT_3,
  SARGAL_NOT_SUBSCRIBED,
  SARGAL_UNSUBSCRIPTION_ONGOING,
  dashboardOpened
} from '..';
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
  getTrioConsoUser
} from 'src/shared';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-dashboard-prepaid-hybrid',
  templateUrl: './dashboard-prepaid-hybrid.component.html',
  styleUrls: ['./dashboard-prepaid-hybrid.component.scss']
})
export class DashboardPrepaidHybridComponent implements OnInit, OnDestroy {
  @Input() userSubscription;
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
  slideOpts = {
    speed: 400,
    slidesPerView: 1.5,
    slideShadows: true
  };
  CODE_COMPTEUR_VOLUME_NUIT_1 = CODE_COMPTEUR_VOLUME_NUIT_1;
  CODE_COMPTEUR_VOLUME_NUIT_2 = CODE_COMPTEUR_VOLUME_NUIT_2;
  CODE_COMPTEUR_VOLUME_NUIT_3 = CODE_COMPTEUR_VOLUME_NUIT_3;
  constructor(
    private dashbordServ: DashboardService,
    private router: Router,
    private authServ: AuthenticationService,
    private banniereServ: BanniereService,
    private sargalServ: SargalService,
    private followService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    if (this.userSubscription) {
      this.currentProfil = this.userSubscription.profil;
    }
    this.banniereServ.setListBanniereByFormule();
    this.banniereServ
      .getStatusLoadingBanniere()
      .subscribe((status: boolean) => {
        this.isBanniereLoaded = status;
        if (this.isBanniereLoaded) {
          this.listBanniere = this.banniereServ.getListBanniereByFormule();
        }
      });
    this.getUserConsommations();
    this.getSargalPoints();

    dashboardOpened.subscribe(x => {
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
    });
  }

  getUserConsommations() {
    this.dataLoaded = false;
    this.error = false;

    this.dashbordServ.getUserConsoInfosByCode().subscribe(
      (res: any[]) => {
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
      // this.followService.registerEventFollow('Sargal-registration-page', 'success', 'clicked');
      this.router.navigate(['/sargal-registration']);
    } else if (
      (this.userSargalData &&
        this.userSargalData.status !== SARGAL_UNSUBSCRIPTION_ONGOING) ||
      (!this.sargalUnavailable && this.sargalDataLoaded)
    ) {
      // this.followService.registerEventFollow('Sargal-dashboard', 'success', 'clicked');
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
    this.router.navigate(['/buy-pass-illimix']);
  }

  goToTransfertOM() {
    this.router.navigate(['/transfer/orange-money']);
  }

  hideMenu() {
    this.opened = false;
  }

  logOut() {
    this.authServ.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {}

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
    this.router.navigate(['/transfer/credit-bonus']);
    // }
  }

  showSoldeOM() {
    this.router.navigate(['activate-om']);
  }

  goToSOSPage() {
    if (this.canDoSOS) {
      this.router.navigate(['/buy-sos']);
    }
  }

  goBuyCredit() {
    this.router.navigate(['/buy-credit']);
  }

  goBuyPassInternet() {
    this.router.navigate(['/buy-pass-internet']);
  }

  goDetailsCom(phoneNumber?: number) {
    phoneNumber = phoneNumber;
    this.router.navigate(['/details-conso']);
  }
  hidePromoBarner() {
    this.showPromoBarner = false;
  }
  onError(input: { el: HTMLElement; display: boolean }[]) {
    input.forEach((item: { el: HTMLElement; display: boolean }) => {
      item.el.style.display = item.display ? 'block' : 'none';
    });
  }
}
