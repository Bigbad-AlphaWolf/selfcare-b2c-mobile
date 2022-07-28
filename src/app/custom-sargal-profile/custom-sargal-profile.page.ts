import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { BonPlanSargalCategoryModel, BonPlanSargalModel, PartnerReductionModel } from '../models/bons-plans-sargal.model';
import { BonsPlansSargalService } from '../services/bons-plans-sargal/bons-plans-sargal.service';

@Component({
  selector: 'app-custom-sargal-profile',
  templateUrl: './custom-sargal-profile.page.html',
  styleUrls: ['./custom-sargal-profile.page.scss'],
})
export class CustomSargalProfilePage implements OnInit {
  loadingCategories: boolean;
  loadingOffers: boolean;
  bpSargalCategories: BonPlanSargalCategoryModel[];
  bpSargal: PartnerReductionModel[];
  sargalCard: BonPlanSargalModel;
  selectedCategoryFilterIndex = 0;

  constructor(private bpSargalService: BonsPlansSargalService) {}

  ngOnInit() {
    this.fetchCategories();
    this.fetchOffers();
  }

  selectCategory(i) {
    if (this.selectedCategoryFilterIndex === i) return;
    this.selectedCategoryFilterIndex = i;
    this.fetchOffers();
  }
  
  fetchCategories() {
    this.loadingCategories = true;
    this.bpSargalService
      .getBonsPlansSargalCategories()
      .pipe(
        tap(categories => {
          this.bpSargalCategories = categories;
          const ALL_FILTER_CATEGORY: BonPlanSargalCategoryModel = {
            nomCategorie: 'Tout',
          };
          this.bpSargalCategories.splice(0, 0, ALL_FILTER_CATEGORY);
          this.loadingCategories = false;
        }),
        catchError(err => {
          this.loadingCategories = false;
          return throwError(err);
        })
      )
      .subscribe();
  }

  fetchOffers() {
    this.loadingOffers = true;
    this.bpSargal = [];
    const categoryId = this.bpSargalCategories?.[this.selectedCategoryFilterIndex]?.id;
    this.bpSargalService
      .getBonsPlansSargal(categoryId)
      .pipe(
        tap((bonsPlansSargal: HttpResponse<BonPlanSargalModel[]>) => {
          this.sargalCard = this.sargalCard ? this.sargalCard : bonsPlansSargal.body[0];
          this.bpSargal = bonsPlansSargal.body[0]?.partnerReductions || [];
          this.loadingOffers = false;
        }),
        catchError(err => {
          this.loadingOffers = false;
          return throwError(err);
        })
      )
      .subscribe();
  }
}
