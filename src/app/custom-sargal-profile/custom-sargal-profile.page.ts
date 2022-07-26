import { Component, OnInit } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { BonPlanSargalCategoryModel, BonPlanSargalModel } from '../models/bons-plans-sargal.model';
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
  bpSargal: BonPlanSargalModel[];
  bpCount: number = 0;
  selectedCategoryFilterIndex = 0;

  constructor(private bpSargalService: BonsPlansSargalService) {}

  ngOnInit() {
    this.fetchCategories();
    this.fetchOffers();
  }

  selectCategory(i) {
    this.selectedCategoryFilterIndex = i;
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
    // this.loadingOffers = true;
    this.bpSargalService
      .getBonsPlansSargal()
      .pipe(
        tap(bonsPlansSargal => {
          this.bpSargal = bonsPlansSargal;
          // this.loadingOffers = false;
        }),
        catchError(err => {
          // this.loadingOffers = false;
          return throwError(err);
        })
      )
      .subscribe();
  }
}
