import { Component, OnInit, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import {
  SargalSubscriptionModel,
  SARGAL_NOT_SUBSCRIBED,
  SARGAL_NOT_SUBSCRIBED_STATUS,
  SARGAL_UNSUBSCRIPTION_ONGOING,
} from 'src/app/dashboard';
import { ScrollVanishDirective } from 'src/app/directives/scroll-vanish/scroll-vanish.directive';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { SargalService } from 'src/app/services/sargal-service/sargal.service';
import { NewUserConsoModel } from 'src/app/services/user-cunsommation-service/user-conso-service.index';
import { UserConsoService } from 'src/app/services/user-cunsommation-service/user-conso.service';
import {
  formatCurrency,
  getLastUpdatedDateTimeText,
  isProfileHybrid,
  SargalStatusModel,
  SubscriptionModel,
} from 'src/shared';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit {
  @ViewChildren(ScrollVanishDirective) dir;
  slideOpts = {
    speed: 400,
    slidesPerView: 1.58,
    slideShadows: true,
  };
  actions = [
    {
      title: 'Acheter',
      subtitle: 'Crédit, pass',
      code: 'BUY',
      icon: '04-boutons-01-illustrations-01-acheter-credit-ou-pass.svg',
    },
    {
      title: 'Transférer',
      subtitle: 'Argent, crédit',
      code: 'TRANSFER',
      icon: '04-boutons-01-illustrations-02-transfert-argent-ou-credit.svg',
    },
    {
      title: 'Payer',
      subtitle: 'Ma facture',
      code: 'BILLS',
      icon: '04-boutons-01-illustrations-03-payer-ma-facture.svg',
    },
    {
      title: 'Payer',
      subtitle: 'un marchand',
      code: 'MERCHANT',
      icon: '04-boutons-01-illustrations-03-payer-ma-facture.svg',
    },
    {
      title: 'Convertir',
      subtitle: 'Points Sargal',
      code: 'SARGAL',
      icon: '04-boutons-01-illustrations-05-convertire-mes-points-sargal.svg',
    },
    {
      title: 'Demander',
      subtitle: 'un SOS',
      code: 'SARGAL',
      icon: '04-boutons-01-illustrations-06-demander-un-sos.svg',
    },
  ];
  currentMsisdn = this.dashboardService.getCurrentPhoneNumber();
  currentProfil: string;
  isHyBride: boolean;

  loadingConso: boolean;
  consoHasError: boolean;
  creditRechargement;
  creditGlobal;
  creditValidity: string;

  loadingSargal: boolean;
  sargalLastUpdate: string;
  sargalUnavailable: boolean;
  userSargalData: SargalSubscriptionModel;

  hasSargalProfile: boolean;
  loadingSargalStatus: boolean;
  sargalStatusUnavailable: boolean;
  sargalStatus: string;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthenticationService,
    private router: Router,
    private followAnalyticsService: FollowAnalyticsService,
    private consoService: UserConsoService,
    private sargalService: SargalService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getCurrentSubscription();
    this.getUserConsommations();
  }

  getCurrentSubscription() {
    this.authService.getSubscription(this.currentMsisdn).subscribe(
      (res: SubscriptionModel) => {
        this.currentProfil = res.profil;
        this.isHyBride = isProfileHybrid(this.currentProfil);
        if (this.isHyBride) {
          this.getCustomerSargalStatus();
        } else {
          this.getSargalPoints();
        }
      },
      () => {}
    );
  }

  getSargalPoints() {
    this.loadingSargal = true;
    this.sargalUnavailable = false;
    const currentNumber = this.dashboardService.getCurrentPhoneNumber();
    this.sargalService.getSargalBalance(currentNumber).subscribe(
      (res: SargalSubscriptionModel) => {
        this.userSargalData = res;
        this.sargalLastUpdate = getLastUpdatedDateTimeText();
        this.loadingSargal = false;
        this.followAnalyticsService.registerEventFollow(
          'Affichage_solde_sargal_success',
          'event',
          currentNumber
        );
      },
      (err) => {
        this.followAnalyticsService.registerEventFollow(
          'Affichage_solde_sargal_error',
          'error',
          { msisdn: currentNumber, error: err.status }
        );
        this.loadingSargal = false;
        if (!this.userSargalData) {
          this.sargalUnavailable = true;
        }
      }
    );
  }

  getUserConsommations() {
    this.loadingConso = true;
    this.consoHasError = false;
    this.consoService
      .getUserCunsomation()
      .pipe(
        tap((conso) => {
          this.loadingConso = false;
          conso.length ? this.processConso(conso) : (this.consoHasError = true);
        }),
        catchError((err) => {
          this.consoHasError = true;
          this.loadingConso = false;
          throw new Error(err);
        })
      )
      .subscribe();
  }

  processConso(consumation: NewUserConsoModel[]) {
    this.getValidityDates(consumation);
    const bonus1 = consumation.find((conso) => conso.codeCompteur === 1)
      ?.montantRestantBrut
      ? consumation.find((conso) => conso.codeCompteur === 1)
          ?.montantRestantBrut
      : 0;
    const bonus2 = consumation.find((conso) => conso.codeCompteur === 1)
      ?.montantRestantBrut
      ? consumation.find((conso) => conso.codeCompteur === 1)
          ?.montantRestantBrut
      : 0;
    const forfaitBalance = consumation.find((conso) => conso.codeCompteur === 9)
      ?.montantRestantBrut
      ? consumation.find((conso) => conso.codeCompteur === 9)
          ?.montantRestantBrut
      : 0;
    this.creditRechargement = consumation.find(
      (conso) => conso.codeCompteur === 1
    )?.montantRestantBrut;
    this.creditGlobal = formatCurrency(
      bonus1 + bonus2 + forfaitBalance + this.creditRechargement
    );
    console.log(this.creditGlobal);
  }

  getValidityDates(appelConso: any[]) {
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

  processDateDMY(date: string) {
    const tab = date.split('/');
    const newDate = new Date(
      Number(tab[2]),
      Number(tab[1]) - 1,
      Number(tab[0])
    );
    return newDate.getTime();
  }

  getCustomerSargalStatus() {
    this.loadingSargalStatus = true;
    this.sargalStatusUnavailable = false;
    this.sargalService.getCustomerSargalStatus().subscribe(
      (sargalStatus: SargalStatusModel) => {
        this.hasSargalProfile = true;
        this.followAnalyticsService.registerEventFollow(
          'Affichage_profil_sargal_success',
          'event',
          this.currentMsisdn
        );
        if (!sargalStatus.valid) {
          this.sargalStatusUnavailable = true;
        }
        this.sargalStatus = sargalStatus.profilClient;
        this.loadingSargalStatus = false;
      },
      (err: any) => {
        this.followAnalyticsService.registerEventFollow(
          'Affichage_profil_sargal_error',
          'error',
          { msisdn: this.currentMsisdn, error: err.status }
        );
        this.loadingSargalStatus = false;
        if (err.status !== 400) {
          this.sargalStatusUnavailable = true;
        }
      }
    );
  }

  search() {
    this.dir.first.show();
  }

  isNotSubscribedToSargal(status: string) {
    return SARGAL_NOT_SUBSCRIBED_STATUS.includes(status);
  }

  seeSargalCard() {
    this.followAnalyticsService.registerEventFollow(
      'Sargal_profil',
      'event',
      'clicked'
    );
    this.router.navigate(['/sargal-status-card']);
  }

  consultConsoDetails(number?: number) {
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

  onSargalCardClicked(origin?: string) {
    if (
      this.userSargalData &&
      (this.userSargalData.status === SARGAL_NOT_SUBSCRIBED ||
        this.userSargalData.status === SARGAL_UNSUBSCRIPTION_ONGOING) &&
      !this.loadingSargal
    ) {
      this.followAnalyticsService.registerEventFollow(
        'Sargal_registration_card_clic',
        'event',
        'clicked'
      );
      this.router.navigate(['/sargal-registration']);
    } else if (!this.sargalUnavailable && !this.loadingSargal) {
      if (origin === 'card') {
        this.followAnalyticsService.registerEventFollow(
          'Sargal_dashboard_card_clic',
          'event',
          'clicked'
        );
      } else {
        this.followAnalyticsService.registerEventFollow(
          'Dashboard_Convertir_Sargal_clic',
          'event',
          'clicked'
        );
      }
      this.router.navigate(['/sargal-dashboard']);
    }
  }
}
