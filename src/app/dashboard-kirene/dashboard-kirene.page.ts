import {Component, OnInit} from '@angular/core';
import * as SecureLS from 'secure-ls';
import {DashboardService} from 'src/app/services/dashboard-service/dashboard.service';
import {Router} from '@angular/router';
import {AuthenticationService} from 'src/app/services/authentication-service/authentication.service';
import {BanniereService} from 'src/app/services/banniere-service/banniere.service';
import {BannierePubModel} from 'src/app/services/dashboard-service';
import {SargalService} from 'src/app/services/sargal-service/sargal.service';
import {
  getLastUpdatedDateTimeText,
  UserConsommations,
  formatCurrency,
  USER_CONS_CATEGORY_CALL,
  WelcomeStatusModel,
  SubscriptionModel,
  getBanniereTitle,
  getBanniereDescription,
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_RECHARGE_CREDIT
} from 'src/shared';
import {FollowAnalyticsService} from 'src/app/services/follow-analytics/follow-analytics.service';
import {
  SargalSubscriptionModel,
  SARGAL_NOT_SUBSCRIBED,
  getConsoByCategory,
  SARGAL_UNSUBSCRIPTION_ONGOING,
  PromoBoosterActive
} from '../dashboard';
import {MatDialog} from '@angular/material/dialog';
import {WelcomePopupComponent} from 'src/shared/welcome-popup/welcome-popup.component';
import {AssistanceService} from '../services/assistance.service';
import {OfferPlansService} from '../services/offer-plans-service/offer-plans.service';
import {OfferPlanActive} from 'src/shared/models/offer-plan-active.model';
import {OrangeMoneyService} from '../services/orange-money-service/orange-money.service';
import {map} from 'rxjs/operators';
import {SelectBeneficiaryPopUpComponent} from '../transfert-hub-services/components/select-beneficiary-pop-up/select-beneficiary-pop-up.component';
import {ModalController} from '@ionic/angular';
import {ApplicationRoutingService} from '../services/application-routing/application-routing.service';
import {BottomSheetService} from '../services/bottom-sheet/bottom-sheet.service';
import {NumberSelectionOption} from '../models/enums/number-selection-option.enum';
import {CreditPassAmountPage} from '../pages/credit-pass-amount/credit-pass-amount.page';
const ls = new SecureLS({encodingType: 'aes'});
@Component({
  selector: 'app-dashboard-kirene',
  templateUrl: './dashboard-kirene.page.html',
  styleUrls: ['./dashboard-kirene.page.scss']
})
export class DashboardKirenePage implements OnInit {
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

  pictures = [{image: '/assets/images/banniere-promo-mob.png'}, {image: '/assets/images/banniere-promo-fibre.png'}];

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
  firstName: string;
  lastName: string;
  hasPromoBooster: PromoBoosterActive = null;
  currentProfil: string;
  hasPromoPlanActive: OfferPlanActive = null;

  constructor(
    private dashbordServ: DashboardService,
    private router: Router,
    private authServ: AuthenticationService,
    private banniereServ: BanniereService,
    private sargalServ: SargalService,
    private followsAnalytics: FollowAnalyticsService,
    private shareDialog: MatDialog,
    private assistanceService: AssistanceService,
    private offerPlanServ: OfferPlansService,
    private omServ: OrangeMoneyService,
    private modalController: ModalController,
    private appRouting: ApplicationRoutingService,
    private bsService: BottomSheetService
  ) {}

  ngOnInit() {
    this.getWelcomeStatus();
    this.getUserInfos();
    this.banniereServ.getListBanniereByFormuleByZone().subscribe((res: any) => {
      this.listBanniere = res;
    });
  }

  ionViewWillEnter() {
    this.getUserConsommations();
    this.getSargalPoints();
    this.getCurrentSubscription();
    this.getUserActiveBonPlans();
    this.getActivePromoBooster();
    this.checkOMNumber();
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
    const currentNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.authServ.getSubscription(currentNumber).subscribe(
      (res: SubscriptionModel) => {
        this.currentProfil = res.profil;
      },
      () => {}
    );
  }

  getActivePromoBooster() {
    this.dashbordServ.getActivePromoBooster().subscribe((res: any) => {
      this.hasPromoBooster = res;
    });
  }

  getUserActiveBonPlans() {
    this.offerPlanServ.getUserTypeOfferPlans().subscribe((res: OfferPlanActive) => {
      this.hasPromoPlanActive = res;
    });
  }

  getUserInfos() {
    const user = ls.get('user');
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }

  getUserConsommations() {
    this.dataLoaded = false;
    this.error = false;
    this.dashbordServ.getUserConsoInfosByCode().subscribe(
      (res: any[]) => {
        if (res.length) {
          const appelConso = res.find(x => x.categorie === 'APPEL').consommations;
          if (appelConso) {
            this.getValidityDates(appelConso);
          }
          this.userConsoSummary = getConsoByCategory(res);
          this.userConsommationsCategories = this.getTrioConsoUser(res);
          this.userCallConsoSummary = this.computeUserConsoSummary(this.userConsoSummary);
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
      () => {
        this.sargalDataLoaded = true;
        if (!this.userSargalData) {
          this.sargalUnavailable = true;
        }
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
    if (this.userSargalData && this.userSargalData.status === SARGAL_NOT_SUBSCRIBED && this.sargalDataLoaded) {
      this.followsAnalytics.registerEventFollow('Sargal-registration-page', 'event', 'clicked');
      this.router.navigate(['/sargal-registration']);
    } else if (
      (this.userSargalData && this.userSargalData.status !== SARGAL_UNSUBSCRIPTION_ONGOING) ||
      (!this.sargalUnavailable && this.sargalDataLoaded)
    ) {
      this.followsAnalytics.registerEventFollow('Sargal-dashboard', 'event', 'clicked');
      this.goToSargalDashboard();
    }
  }

  getTrioConsoUser(consoSummary: UserConsommations) {
    const result = [];
    if (consoSummary) {
      consoSummary.forEach(x => {
        for (const cons of x.consommations) {
          if (result.length < 3) {
            result.push(cons);
          }
        }
      });
    }
    return result;
  }

  logOut() {
    this.authServ.logout();
    this.router.navigate(['/']);
  }

  hidePromoBarner() {
    ls.set('banner', false);
    this.showPromoBarner = false;
    this.followsAnalytics.registerEventFollow('Banner_close_dashboard', 'event', 'Mobile');
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
      this.canTransferBonus = this.creditRechargement > 20 && this.soldebonus > 1;
    }

    return {
      globalCredit: formatCurrency(globalCredit),
      balance: formatCurrency(balance),
      isHybrid
    };
  }

  showSoldeOM() {
    this.followsAnalytics.registerEventFollow('Click_Voir_solde_OM_dashboard', 'event', 'clicked');
    this.router.navigate(['activate-om']);
  }

  openSosCreditPage() {
    this.canDoSOS = this.creditRechargement < 489;
    if (this.canDoSOS) {
      this.router.navigate(['/buy-sos']);
      this.followsAnalytics.registerEventFollow('Recharge_dashboard', 'event', 'clicked');
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
    const newDate = new Date(Number(tab[2]), Number(tab[1]) - 1, Number(tab[0]));
    return newDate.getTime();
  }

  goToIllimixPage() {
    this.followsAnalytics.registerEventFollow('Achat_Mixel_from_dashboard', 'event', 'clicked');
    this.openModalPassNumberSelection(OPERATION_TYPE_PASS_ILLIMIX, 'list-pass');
  }

  transferCreditOrPass() {
    if (!this.canDoSOS || this.canTransferBonus) {
      this.router.navigate(['/transfer/credit-bonus']);
      this.followsAnalytics.registerEventFollow('Transfert_dashboard', 'event', 'clicked');
    }
  }

  goToTransfertOM() {
    this.showBeneficiaryModal();
    this.followsAnalytics.registerEventFollow('Transfert_OM_dashboard', 'event', 'clicked');
  }

  async showBeneficiaryModal() {
    const modal = await this.modalController.create({
      component: SelectBeneficiaryPopUpComponent,
      cssClass: 'select-recipient-modal'
    });
    modal.onWillDismiss().then((response: any) => {
      if (response && response.data && response.data.recipientMsisdn) {
        const pageData = response.data;
        this.appRouting.goSetTransferAmountPage(pageData);
        // this.getOmPhoneNumberAndCheckrecipientHasOMAccount(this.dataPayload);
      }
    });
    return await modal.present();
  }

  goBuyCredit() {
    this.openModalPassNumberSelection(OPERATION_TYPE_RECHARGE_CREDIT, CreditPassAmountPage.PATH);
    this.followsAnalytics.registerEventFollow('Recharge_dashboard', 'event', 'clicked');
  }

  goBuyPassInternet() {
    this.followsAnalytics.registerEventFollow('Pass_internet_dashboard', 'event', 'clicked');
    this.openModalPassNumberSelection(OPERATION_TYPE_PASS_INTERNET, 'list-pass');
  }

  openModalPassNumberSelection(operation: string, routePath: string) {
    this.bsService.openNumberSelectionBottomSheet(NumberSelectionOption.WITH_MY_PHONES, operation, routePath, false);
  }

  onError(input: {el: HTMLElement; display: boolean}[]) {
    input.forEach((item: {el: HTMLElement; display: boolean}) => {
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
}
