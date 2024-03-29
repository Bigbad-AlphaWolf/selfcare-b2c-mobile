import { Component, OnInit } from '@angular/core';
import * as SecureLS from 'secure-ls';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { PassInternetService } from 'src/app/services/pass-internet-service/pass-internet.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { NavigationExtras, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import {
  arrangeCompteurByOrdre,
  getTrioConsoUser,
  formatDataVolume,
  UserConsommations,
  formatCurrency,
  USER_CONS_CATEGORY_CALL,
  USER_CONS_CATEGORY_INTERNET,
  SubscriptionModel,
  WelcomeStatusModel,
  getBanniereTitle,
  getBanniereDescription,
  OPERATION_TYPE_PASS_INTERNET,
} from 'src/shared';
import { getConsoByCategory, CODE_COMPTEUR_VOLUME_NUIT_1, CODE_COMPTEUR_VOLUME_NUIT_2, CODE_COMPTEUR_VOLUME_NUIT_3 } from '../dashboard';
import { MatDialog } from '@angular/material/dialog';
import { WelcomePopupComponent } from 'src/shared/welcome-popup/welcome-popup.component';
import { AssistanceService } from '../services/assistance.service';
import { BanniereService } from '../services/banniere-service/banniere.service';
import { map } from 'rxjs/operators';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { OemLoggingService } from '../services/oem-logging/oem-logging.service';
const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'app-dashboard-home-prepaid',
  templateUrl: './dashboard-home-prepaid.page.html',
  styleUrls: ['./dashboard-home-prepaid.page.scss'],
})
export class DashboardHomePrepaidPage implements OnInit {
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
    slidesPerView: 1.5,
    slideShadows: true,
  };
  pictures = ['/assets/images/banniere-promo-mob.png', '/assets/images/banniere-promo-fibre.png'];
  showPromoBanner = ls.get('banner');
  listBanniere: BannierePubModel[] = [];
  listPass: any[] = [];
  loadingConso;
  errorOnLoadingConso;
  firstName: string;
  lastName: string;
  isBanniereLoaded: boolean;
  currentUserCodeFormule: string;
  constructor(
    private passIntService: PassInternetService,
    private dashbdSrv: DashboardService,
    private router: Router,
    private oemLoggingService: OemLoggingService,
    private authServ: AuthenticationService,
    private shareDialog: MatDialog,
    private assistanceService: AssistanceService,
    private banniereServ: BanniereService,
    private omServ: OrangeMoneyService
  ) {}

  ngOnInit() {
    this.src = this.pictures[0];
    this.getConso();
    this.getPassInternetFixe();
    this.getUserInfos();
    this.getWelcomeStatus();
    this.banniereServ.getListBanniereByFormuleByZone().subscribe((res: any) => {
      this.listBanniere = res;
    });
  }

  ionViewWillEnter() {
    this.checkOMNumber();
  }

  getUserInfos() {
    const user = ls.get('user');
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }

  checkOMNumber() {
    this.omServ
      .getOmMsisdn()
      .pipe(
        map(omNumber => {
          if (omNumber !== 'error') {
            this.dashbdSrv.swapOMCard();
          }
        })
      )
      .subscribe();
  }

  getConso() {
    this.loadingConso = true;
    this.errorOnLoadingConso = false;
    this.userCallConsoSummary = null;
    this.userConsommationsCategories = [];
    this.dashbdSrv.getUserConsoInfosByCode().subscribe(
      (res: any) => {
        if (res.length) {
          this.oemLoggingService.registerEvent('dashboard_conso_fixe_prepaid');
          const orderedConso = arrangeCompteurByOrdre(res);
          const appelConso = orderedConso.length ? orderedConso.find(x => x.categorie === USER_CONS_CATEGORY_CALL).consommations : null;
          const internetConso = orderedConso.length
            ? orderedConso.find(x => x.categorie === USER_CONS_CATEGORY_INTERNET)
              ? orderedConso.find(x => x.categorie === USER_CONS_CATEGORY_INTERNET).consommations
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
          this.userCallConsoSummary = this.computeUserConsoSummary(this.userConsoSummary);
        } else {
          this.errorOnLoadingConso = true;
        }
        this.loadingConso = false;
      },
      () => {
        this.loadingConso = false;
        this.errorOnLoadingConso = true;
      }
    );
  }

  getPassInternetFixe() {
    const userPhoneNumber = this.dashbdSrv.getCurrentPhoneNumber();
    this.authServ.getSubscription(userPhoneNumber).subscribe((res: SubscriptionModel) => {
      this.currentUserCodeFormule = res?.code;
      if (res.code !== '0') {
        this.passIntService.setUserCodeFormule(res.code);
        this.passIntService.queryListPassInternetOfUser(res.code, userPhoneNumber).subscribe(
          (result: any) => {
            if (result) {
              this.listPass = this.passIntService.getListPassInternetOfUser();
            }
          },
          (err: any) => {
            console.log('error');
          }
        );
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
        if (x.code !== CODE_COMPTEUR_VOLUME_NUIT_1 && x.code !== CODE_COMPTEUR_VOLUME_NUIT_2 && x.code !== CODE_COMPTEUR_VOLUME_NUIT_3) {
          consoData += x.montant;
        }
      });
    }

    return {
      globalCredit: formatCurrency(globalCredit),
      consoData: formatDataVolume(consoData),
    };
  }

  processDateDMY(date: string) {
    const tab = date.split('/');
    const newDate = new Date(Number(tab[2]), Number(tab[1]) - 1, Number(tab[0]));
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
    this.oemLoggingService.registerEvent('Banner_close_dashboard');
    ls.set('banner', false);
    this.showPromoBanner = false;
  }

  goDetailsCom(number?: number) {
    this.router.navigate(['/details-conso']);
    number ? this.oemLoggingService.registerEvent('Voirs_details_dashboard') : this.oemLoggingService.registerEvent('Voirs_details_card_dashboard');
  }

  //selectPass(id: number) {
  //  this.followsAnalytics.registerEventFollow('Pass_internet_dashboard_fix', 'event', 'clicked');
  //  this.router.navigate([`/buy-pass-internet/${id}`]);
  //}

  choosePass(pass: any) {
    this.oemLoggingService.registerEvent('Pass_internet_dashboard_fix');
    const userPhoneNumber = this.dashbdSrv.getCurrentPhoneNumber();
    let navigationExtras: NavigationExtras = {
      state: {
        pass,
        recipientMsisdn: userPhoneNumber,
        recipientCodeFormule: this.currentUserCodeFormule,
        purchaseType: OPERATION_TYPE_PASS_INTERNET,
        isLightMod: false,
      },
    };
    this.router.navigate(['/operation-recap'], navigationExtras);
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
    const number = this.dashbdSrv.getMainPhoneNumber();
    this.dashbdSrv.getAccountInfo(number).subscribe(
      (resp: any) => {
        ls.set('user', resp);
        if (!resp.tutoViewed) {
          this.dashbdSrv.getActivePromoBooster().subscribe((res: any) => {
            this.dashbdSrv.getWelcomeStatus(res).subscribe(
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
}
