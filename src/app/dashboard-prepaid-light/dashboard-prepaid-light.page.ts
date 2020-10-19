import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  formatCurrency,
  getBanniereDescription,
  getBanniereTitle,
  getLastUpdatedDateTimeText,
  getTrioConsoUser,
  SargalStatusModel,
  SubscriptionModel,
  UserConsommations,
  USER_CONS_CATEGORY_CALL,
} from 'src/shared';
import {
  CODE_COMPTEUR_VOLUME_NUIT_1,
  CODE_COMPTEUR_VOLUME_NUIT_2,
  CODE_COMPTEUR_VOLUME_NUIT_3,
  getConsoByCategory,
  PROFILE_TYPE_HYBRID,
  PROFILE_TYPE_HYBRID_1,
  PROFILE_TYPE_HYBRID_2,
  PROFILE_TYPE_PREPAID,
  PromoBoosterActive,
  SargalSubscriptionModel,
  SARGAL_NOT_SUBSCRIBED,
  SARGAL_UNSUBSCRIPTION_ONGOING,
} from '../dashboard';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { BanniereService } from '../services/banniere-service/banniere.service';
import { BannierePubModel } from '../services/dashboard-service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { SargalService } from '../services/sargal-service/sargal.service';
import * as SecureLS from 'secure-ls';
import { ModalController } from '@ionic/angular';
import { ActionLightComponent } from './components/action-light-modal/action-light/action-light.component';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-dashboard-prepaid-light',
  templateUrl: './dashboard-prepaid-light.page.html',
  styleUrls: ['./dashboard-prepaid-light.page.scss'],
})
export class DashboardPrepaidLightPage implements OnInit {
  userName: string;
  loadingConso: boolean;
  consoHasError: boolean;
  userConsoSummary: any = {};
  userCallConsoSummary: {
    globalCredit: number;
    balance: number;
    isHybrid: boolean;
  } = null;
  userConsommations = {};
  userConsommationsCategories = [];
  soldebonus: number;
  creditRechargement: number;
  canDoSOS: boolean;
  canTransferBonus: boolean;
  balanceValidity: string;
  creditValidity: string;
  isCheckingSargalProfile: boolean;
  userHasNoSargalProfil: boolean;
  sargalStatusUnavailable: boolean;
  sargalPointsLoading: boolean;
  sargalUnavailable: boolean;
  userSargalSubscription: SargalSubscriptionModel;
  sargalLastUpdate: string;
  hasPromoBooster: PromoBoosterActive = null;
  userPhoneNumber: string;
  PROFILE_TYPE_PREPAID = PROFILE_TYPE_PREPAID;
  PROFILE_TYPE_HYBRID = PROFILE_TYPE_HYBRID;
  PROFILE_TYPE_HYBRID_1 = PROFILE_TYPE_HYBRID_1;
  PROFILE_TYPE_HYBRID_2 = PROFILE_TYPE_HYBRID_2;
  CODE_COMPTEUR_VOLUME_NUIT_1 = CODE_COMPTEUR_VOLUME_NUIT_1;
  CODE_COMPTEUR_VOLUME_NUIT_2 = CODE_COMPTEUR_VOLUME_NUIT_2;
  CODE_COMPTEUR_VOLUME_NUIT_3 = CODE_COMPTEUR_VOLUME_NUIT_3;
  SARGAL_NOT_SUBSCRIBED = SARGAL_NOT_SUBSCRIBED;
  SARGAL_UNSUBSCRIPTION_ONGOING = SARGAL_UNSUBSCRIPTION_ONGOING;
  currentProfil: string;
  operationsButtons: any[] = [
    {
      title: 'Acheter',
      subtitle: 'Crédit, pass',
      imgName: 'ic-package-services@2x.png',
      action: 'BUY',
    },
    {
      title: 'Transférer',
      subtitle: 'Argent, crédit',
      imgName: 'ic-transfer-data.svg',
      action: 'TRANSFER',
    },
    {
      title: 'Payer OM',
      subtitle: 'Facture',
      imgName: 'ic-orange-money.svg',
      action: 'OM',
    },
  ];
  listBanniere: BannierePubModel[] = [];
  slideOpts = {
    speed: 400,
    slidesPerView: 1.68,
    slideShadows: true,
  };
  constructor(
    private dashboardService: DashboardService,
    private sargalService: SargalService,
    private banniereService: BanniereService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.userPhoneNumber = this.dashboardService.getCurrentPhoneNumber();
    this.loadUserConsommation();
    this.getSargalPoints();
    this.getCustomerSargalStatus();
    this.authenticationService
      .getSubscriptionForTiers(this.userPhoneNumber)
      .subscribe((res: SubscriptionModel) => {
        this.currentProfil = res.profil;
        this.getActivePromoBooster(this.userPhoneNumber, res.code);
      });
    this.banniereService.setListBanniereByFormule();
    this.banniereService
      .getStatusLoadingBanniere()
      .subscribe((isBanniereLoaded: boolean) => {
        if (isBanniereLoaded) {
          this.listBanniere = this.banniereService.getListBanniereByFormule();
        }
      });
  }

  loadUserConsommation() {
    this.consoHasError = false;
    this.loadingConso = true;
    const hmac = this.authenticationService.getHmac();
    this.dashboardService.getUserConsoInfosByCode(hmac).subscribe(
      (res: any[]) => {
        if (res.length) {
          const appelConso = res.find((x) => x.categorie === 'APPEL')
            .consommations;
          if (appelConso) {
            this.getValidityDates(appelConso);
          }
          this.userConsoSummary = getConsoByCategory(res);
          this.userConsommationsCategories = getTrioConsoUser(res);
          this.userCallConsoSummary = this.computeUserConsoSummary(
            this.userConsoSummary
          );
        } else {
          this.consoHasError = true;
        }
        this.loadingConso = false;
      },
      (err) => {
        this.consoHasError = true;
        this.loadingConso = false;
      }
    );
  }

  computeUserConsoSummary(consoSummary: UserConsommations) {
    const callConsos = consoSummary[USER_CONS_CATEGORY_CALL];
    let globalCredit = 0;
    let balance = 0;
    let isHybrid = false;
    this.soldebonus = 0;
    this.creditRechargement = 0;
    if (callConsos) {
      callConsos.forEach((x) => {
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
      isHybrid,
    };
  }

  getCustomerSargalStatus() {
    this.isCheckingSargalProfile = true;
    this.sargalStatusUnavailable = false;
    this.userHasNoSargalProfil = false;
    this.sargalService.getCustomerSargalStatus().subscribe(
      (sargalStatus: SargalStatusModel) => {
        if (!sargalStatus.valid) {
          this.sargalStatusUnavailable = true;
        }
        this.isCheckingSargalProfile = false;
      },
      (err: any) => {
        this.isCheckingSargalProfile = false;
        if (err.status !== 400) {
          this.userHasNoSargalProfil = true;
        } else {
          this.sargalStatusUnavailable = true;
        }
      }
    );
  }

  getSargalPoints() {
    this.sargalPointsLoading = true;
    this.sargalUnavailable = false;
    const currentNumber = this.dashboardService.getCurrentPhoneNumber();
    const hmac = this.authenticationService.getHmac();
    this.sargalService.getSargalBalance(currentNumber, hmac).subscribe(
      (res: SargalSubscriptionModel) => {
        this.userSargalSubscription = res;
        this.sargalLastUpdate = getLastUpdatedDateTimeText();
        const sargal = {
          sargalData: this.userSargalSubscription,
          lastUpdate: this.sargalLastUpdate,
        };
        ls.set('sargalPoints-' + currentNumber, sargal);
        this.sargalPointsLoading = false;
      },
      (err: any) => {
        this.sargalPointsLoading = false;
        const data = ls.get('sargalPoints-' + currentNumber);
        if (data) {
          this.userSargalSubscription = data.sargalData;
          this.sargalLastUpdate = data.lastUpdate;
        } else {
          this.sargalUnavailable = true;
        }
      }
    );
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
    let forfaitBalance;
    if (appelConso) {
      forfaitBalance = appelConso.find((x) => x.code === 9);
      if (forfaitBalance) {
        this.balanceValidity = forfaitBalance.dateExpiration.substring(0, 10);
      }
      let longestDate = 0;
      appelConso.forEach((conso) => {
        const dateDMY = conso.dateExpiration.substring(0, 10);
        const date = this.processDateDMY(dateDMY);
        if (date > longestDate) {
          longestDate = date;
          this.creditValidity = dateDMY;
        }
      });
    }
  }

  getActivePromoBooster(msisdn: string, code: string) {
    this.dashboardService.getActivePromoBooster().subscribe((res: any) => {
      this.hasPromoBooster = res;
    });
  }

  getBanniereTitle(description: string) {
    return getBanniereTitle(description);
  }

  getBanniereDescription(description: string) {
    return getBanniereDescription(description);
  }

  onError(input: { el: HTMLElement; display: boolean }[]) {
    input.forEach((item: { el: HTMLElement; display: boolean }) => {
      item.el.style.display = item.display ? 'block' : 'none';
    });
  }

  goBackHome() {
    this.router.navigate(['/']);
  }

  async onOperation(operation) {
    const modal = await this.modalController.create({
      component: ActionLightComponent,
      cssClass: 'select-recipient-modal',
    });
    return await modal.present();
  }
}
