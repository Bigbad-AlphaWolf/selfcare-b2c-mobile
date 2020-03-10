import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import {
  computeConsoHistory,
  arrangeCompteurByOrdre,
  PurchaseModel
} from 'src/shared';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { PurchaseService } from '../services/purchase-service/purchase.service';

@Component({
  selector: 'app-details-conso',
  templateUrl: './details-conso.page.html',
  styleUrls: ['./details-conso.page.scss']
})
export class DetailsConsoPage implements OnInit {
  detailsLoading;
  histLoading;
  details = true;
  historique = false;
  consommations = [];
  error;
  notdata = false;
  appels: any;
  consoDetails: any = [];
  consoshistorique: any;
  chargeTypes: any = [];
  chargeType = 'Compteurs';
  currentProfil;
  dateFilterItems = [
    { title: '2 derniers jours', value: 2 },
    { title: '3 derniers jours', value: 3 },
    { title: '5 derniers jours', value: 5 },
    { title: '7 derniers jours', value: 7 }
  ];
  day = 0;
  selectedDate = this.dateFilterItems[0];
  histPurchaseLoading: boolean;
  histPurchaseHasError: boolean;
  listPurchaseForDays: PurchaseModel[] = [];
  listPurchaseForDayByType: PurchaseModel[] = [];
  purchaseDateFilterSelected = 2;
  purchaseTypeFilterSelected: { nom: string; value: string } = {
    nom: 'Tous',
    value: undefined
  };
  userPhoneNumber: string;
  constructor(
    private dashboardservice: DashboardService,
    private authService: AuthenticationService,
    private followAnalyticsService: FollowAnalyticsService,
    private purchaseServ: PurchaseService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.userPhoneNumber = this.dashboardservice.getCurrentPhoneNumber();
    this.authService
      .getSubscription(this.userPhoneNumber)
      .subscribe((res: any) => {
        this.followAnalyticsService.registerEventFollow(
          'Voir_details_dashboard',
          'event',
          'Opened'
        );
        this.currentProfil = res.profil;
        if (this.currentProfil === 'POSTPAID') {
          this.historique = true;
          this.details = false;
          this.getPostpaidUserHistory(2);
        } else {
          this.getPrepaidUserHistory(2);
          this.getUserConsoInfos();
          if (this.currentProfil === 'PREPAID') {
            this.getTransactionsByDay(this.purchaseDateFilterSelected);
          }
        }
      });
  }

  getTransactionsByDay(
    day: number,
    filterType?: { nom: string; value: string }
  ) {
    this.purchaseDateFilterSelected = day;
    if (filterType) {
      this.getTransactionByDaysByType(filterType);
    } else {
      this.histPurchaseLoading = true;
      this.histPurchaseHasError = false;
      this.purchaseServ
        .getAllTransactionByDay(this.userPhoneNumber, day)
        .subscribe(
          (res: PurchaseModel[]) => {
            this.histPurchaseLoading = false;
            this.histPurchaseHasError = false;
            this.listPurchaseForDays = res;
            this.listPurchaseForDayByType = this.purchaseServ.filterPurchaseByType(
              this.listPurchaseForDays,
              this.purchaseTypeFilterSelected
            );
          },
          (err: any) => {
            this.histPurchaseLoading = false;
            this.histPurchaseHasError = true;
          }
        );
    }
  }
  getTransactionByDaysByType(filter: { nom: string; value: string }) {
    this.purchaseTypeFilterSelected = filter;
    this.listPurchaseForDayByType = this.purchaseServ.filterPurchaseByType(
      this.listPurchaseForDays,
      filter
    );
  }

  getUserConsoInfos() {
    this.detailsLoading = true;
    this.dashboardservice.getUserConsoInfosByCode().subscribe(
      (res: any) => {
        if (res.length) {
          res = arrangeCompteurByOrdre(res);
        }
        this.consoDetails = res;
        this.detailsLoading = false;
      },
      () => {
        this.detailsLoading = false;
      }
    );
  }

  getChargeTypes() {
    this.chargeTypes = [];
    if (this.consoshistorique.length > 0) {
      this.chargeTypes.push('Compteurs');
      this.consoshistorique.forEach(element => {
        this.chargeTypes.push(element.chargeType);
      });
      this.chargeTypes = new Set(this.chargeTypes);
    }
  }

  getPrepaidUserHistory(day) {
    this.histLoading = true;
    this.error = false;
    this.notdata = false;
    this.chargeType = 'Compteurs';
    this.chargeTypes = [];
    this.dashboardservice.getUserConso(day).subscribe(
      (res: any) => {
        this.histLoading = false;
        res.length === 0 ? (this.notdata = true) : (this.notdata = false);
        this.consommations = computeConsoHistory(res);
        this.consoshistorique = this.consommations;
        this.getChargeTypes();
      },
      () => {
        this.histLoading = false;
        this.error = true;
      }
    );
  }

  getPrepaidHistoryByDay(day) {
    this.getPrepaidUserHistory(parseInt(day, 10));
  }

  getPostpaidUserHistory(day) {
    this.histLoading = true;
    this.error = false;
    this.notdata = false;
    this.chargeType = 'Compteurs';
    this.chargeTypes = [];
    this.dashboardservice.getPostpaidConsoHistory(day).subscribe(
      (historique: any[]) => {
        this.histLoading = false;
        historique.length === 0
          ? (this.notdata = true)
          : (this.notdata = false);
        this.consoshistorique = historique.filter(
          conso => !(conso.type === 'data' && conso.volume === '0')
        );
      },
      () => {
        this.histLoading = false;
        this.error = true;
      }
    );
  }

  getPostpaidHistoryByDay(day) {
    this.getPostpaidUserHistory(parseInt(day, 10));
  }

  getConsoByDay(day) {
    if (this.day !== day) {
      this.consoshistorique = [];
      this.selectedDate = this.dateFilterItems.find(x => x.value === day);
      this.day = day;
      if (this.currentProfil === 'POSTPAID') {
        this.getPostpaidUserHistory(parseInt(day, 10));
      } else {
        this.getPrepaidUserHistory(parseInt(day, 10));
      }
    }
  }

  selectedFilterButton(chargeType?: string) {
    if (chargeType === 'Compteurs') {
      this.consoshistorique = this.consommations;
    } else {
      this.consoshistorique = this.consommations.filter(x => {
        return x.chargeType.trim().includes(chargeType);
      });
    }
    this.chargeType = chargeType;
    return this.consoshistorique;
  }

  historiqueSelected() {
    window.scroll(0, 0);
    this.historique = true;
    this.details = false;
  }

  detailsSelected() {
    window.scroll(0, 0);
    this.details = true;
    this.historique = false;
  }
}
