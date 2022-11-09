import { Component, OnInit } from '@angular/core';
import { GiftSargalItem, GiftSargalCategoryItem, getLastUpdatedDateTimeText } from 'src/shared';
import { SargalSubscriptionModel, OPERATION_TYPE_SARGAL_CONVERSION, PAYMENT_MOD_SARGAL } from 'src/app/dashboard';
import { Router, ActivatedRoute } from '@angular/router';
import { SargalService } from 'src/app/services/sargal-service/sargal.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import * as SecureLS from 'secure-ls';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-sargal-catalogue',
  templateUrl: './sargal-catalogue.page.html',
  styleUrls: ['./sargal-catalogue.page.scss'],
})
export class SargalCataloguePage implements OnInit {
  categoriesGiftSargal = [];
  listGiftSargal: GiftSargalItem[];
  listShownGiftSargal: GiftSargalItem[] = [];
  userSargalPoints: number;
  sargalBalanceLoaded: boolean;
  categoryGiftSargal: GiftSargalCategoryItem;
  errorMsg: string;
  dataLoaded: boolean;
  giftSargalSelected: GiftSargalItem;
  currentNumber: string;
  OPERATION_TYPE_SARGAL_CONVERSION = OPERATION_TYPE_SARGAL_CONVERSION;
  PAYMENT_MOD_SARGAL = PAYMENT_MOD_SARGAL;
  step: 'CHOOSE_GIFT' | 'VALIDATION' | 'SUCCESS';
  failed: boolean;
  conversionLoading: boolean;
  sargalLastUpdate: string;
  hasError: boolean;
  constructor(
    private router: Router,
    private sargalServ: SargalService,
    private activatedRoute: ActivatedRoute,
    private dashServ: DashboardService,
    private oemLoggingService: OemLoggingService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.step = 'CHOOSE_GIFT';
    this.reloadData();
    this.getSargalBalance();
  }

  reloadData() {
    this.currentNumber = this.dashServ.getCurrentPhoneNumber();
    this.sargalServ.setUserPhoneNumber(this.currentNumber);
    this.sargalServ.setListGiftSargalAndCategoryOfUserByQuery();
    this.sargalServ.getStatusDataLoaded().subscribe((res: any) => {
      const detail = res;
      this.dataLoaded = res.status;
      this.hasError = res.error;
      if (this.dataLoaded && this.activatedRoute && !this.hasError) {
        this.categoriesGiftSargal = this.sargalServ.getListCategoryGiftSargal();

        this.listGiftSargal = this.sargalServ.getListGiftSargalOfUser();
        this.activatedRoute.paramMap.subscribe(params => {
          const codeCategory = params.has('categoryGift') ? params.get('categoryGift') : null;
          if (this.dataLoaded) {
            const categorie = this.categoriesGiftSargal.find((item: GiftSargalCategoryItem) => {
              return item.id === +codeCategory;
            });
            this.filterByCategory(categorie);
          }
        });
      }
    });
  }

  getSargalBalance() {
    this.sargalServ.getSargalBalance(this.currentNumber).subscribe(
      (res: SargalSubscriptionModel) => {
        this.sargalBalanceLoaded = true;
        if (res.status === 'SUBSCRIBED' || res.status === 'SUBSCRIPTION_ONGOING') {
          this.userSargalPoints = res.totalPoints;
          this.sargalLastUpdate = getLastUpdatedDateTimeText();

          const sargal = {
            sargalPts: this.userSargalPoints,
            lastUpdate: this.sargalLastUpdate,
          };
          ls.set('sargalPoints', sargal);
        }
      },
      (err: any) => {
        this.sargalBalanceLoaded = true;
        const data = ls.get('sargalPoints');
        if (data) {
          this.userSargalPoints = data.sargalPts;
          this.sargalLastUpdate = data.lastUpdate;
        }
      }
    );
  }

  goBack() {
    if (this.step === 'CHOOSE_GIFT') {
      this.router.navigate(['/sargal-dashboard']);
    } else {
      this.step = 'CHOOSE_GIFT';
    }
  }

  filterByCategory(category: GiftSargalCategoryItem) {
    if (category) {
      this.categoryGiftSargal = category;
      this.listShownGiftSargal = this.sargalServ.filterGiftItemByCategory(this.categoryGiftSargal, this.listGiftSargal);
    } else {
      this.listShownGiftSargal = this.listGiftSargal;
      this.categoryGiftSargal = null;
    }
  }

  reverseList(ordre: string) {
    if (ordre === 'asc') {
      this.listShownGiftSargal.sort((item1: GiftSargalItem, item2: GiftSargalItem) => +item1.prix - +item2.prix);
    } else {
      this.listShownGiftSargal.sort((item1: GiftSargalItem, item2: GiftSargalItem) => +item2.prix - +item1.prix);
    }
  }

  selectGiftSargal(gift: GiftSargalItem) {
    this.giftSargalSelected = gift;
    this.step = 'VALIDATION';
  }

  convertPointsToGift(numeroIllimite?: string[]) {
    this.conversionLoading = true;
    this.sargalServ.convertToGift(this.giftSargalSelected, numeroIllimite).subscribe(
      (res: any) => {
        this.conversionLoading = true;
        this.step = 'SUCCESS';
        this.failed = false;
        this.oemLoggingService.registerEvent(
          'Convert_Gift_Sargal_Success',
          convertObjectToLoggingPayload({
            giftID: this.giftSargalSelected.giftId,
            numeroIllimites: numeroIllimite,
            giftName: this.giftSargalSelected.nom,
            giftSargalPts: this.giftSargalSelected.prix,
            msisdn: this.currentNumber,
          })
        );
      },
      err => {
        this.conversionLoading = true;
        this.errorMsg = 'Une erreur est survenue';
        this.step = 'SUCCESS';
        this.failed = true;
        this.oemLoggingService.registerEvent(
          'Convert_Gift_Sargal_Error',
          convertObjectToLoggingPayload({
            giftID: this.giftSargalSelected.giftId,
            numeroIllimites: numeroIllimite,
            giftName: this.giftSargalSelected.nom,
            giftSargalPts: this.giftSargalSelected.prix,
            msisdn: this.currentNumber,
            error: err && err.status ? err.status : 'Erreur durant le traitement de la requête',
          })
        );
      }
    );
  }

  goToPartnerSargal() {
    this.oemLoggingService.registerEvent('Partenaire-Sargal-Dashboard');
    // this.router.navigate(['/sargal-partenaire']);
  }
}
