import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import {
  computeConsoHistory,
  arrangeCompteurByOrdre,
  DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY
} from 'src/shared';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { PurchaseService } from '../services/purchase-service/purchase.service';
import { IonSlides } from '@ionic/angular';
import { PROFILE_TYPE_POSTPAID } from '../dashboard';
import { tap } from 'rxjs/operators';
import { CategoryPurchaseHistory } from '../models/category-purchase-history.model';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { PurchaseModel } from '../models/purchase.model';

@AutoUnsubscribe()
@Component({
  selector: 'app-details-conso',
  templateUrl: './details-conso.page.html',
  styleUrls: ['./details-conso.page.scss']
})
export class DetailsConsoPage implements OnInit {
  detailsLoading;
  histLoading;
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
  purchaseTypeFilterSelected: { label: string; typeAchat: string } = DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY;
  userPhoneNumber: string;
  listCategoryPurchaseHistory: CategoryPurchaseHistory[] = []
  @ViewChild('consoTab') slideGroup: IonSlides;
  slideSelected = 0;
  slideOpts = {
    speed: 400,
    slidesPerView: 1,
    slideShadows: true
  };
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
          this.getPostpaidUserHistory(2);
        } else {
          this.getPrepaidUserHistory(2);
          this.getUserConsoInfos();
          this.getTransactionsByDay(this.purchaseDateFilterSelected);

        }
      });
  }

  goNext(tabIndex?:number){
    this.slideGroup.getActiveIndex().then(index => {
      this.seeSlide(index);
    });
  }

  seeSlide(tabIndex: number){
    this.slideGroup.slideTo(tabIndex);
    this.slideSelected = tabIndex;
    if(this.currentProfil !== PROFILE_TYPE_POSTPAID){
      if(tabIndex === 1){
        this.followAnalyticsService.registerEventFollow("Historique_Appels","event","clic")
      }else if(tabIndex === 2){
        this.followAnalyticsService.registerEventFollow("Historique_Souscriptions","event","clic")
      }
    }
  }

  getTransactionsByDay(
    day: number,
    filterType?: { label: string; typeAchat: string }
  ) {
    this.purchaseDateFilterSelected = day;
    if (filterType) {
      this.getTransactionByDaysByType(filterType);
    } else {
      this.histPurchaseLoading = true;
      this.histPurchaseHasError = false;
      this.purchaseServ
        .getCategoriesAndPurchaseHistory(this.userPhoneNumber, day).pipe((tap((res: {categories: CategoryPurchaseHistory[], listPurchase: PurchaseModel[] }) => {
          this.listCategoryPurchaseHistory = res.categories;
          this.listPurchaseForDays = res.listPurchase;
          this.listPurchaseForDayByType = this.purchaseServ.filterPurchaseByType(
              this.listPurchaseForDays,
              DEFAULT_SELECTED_CATEGORY_PURCHASE_HISTORY
            );
        })))
        .subscribe(
          (res: any) => {
            this.histPurchaseLoading = false;
            this.histPurchaseHasError = false;
          },
          (err: any) => {
            this.histPurchaseLoading = false;
            this.histPurchaseHasError = true;
          }
        );
    }
  }
  getTransactionByDaysByType(filter: { label: string; typeAchat: string }) {
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
        if (res && res.length) {
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

  ngOnDestroy() {}

}
