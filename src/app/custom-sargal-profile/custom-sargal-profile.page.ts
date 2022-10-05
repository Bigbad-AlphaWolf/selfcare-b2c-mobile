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
  allBpSargal: PartnerReductionModel[];
  sargalCard: BonPlanSargalModel;
	ALL_FILTER_CATEGORY: BonPlanSargalCategoryModel = {  nomCategorie: 'Tout', id: null  };
  selectedCategoryFilter: BonPlanSargalCategoryModel = this.ALL_FILTER_CATEGORY;
  constructor(private bpSargalService: BonsPlansSargalService) {}

  ngOnInit() {
    this.fetchOffers();
  }

  selectCategory(category: BonPlanSargalCategoryModel) {
		this.selectedCategoryFilter = category;
		if(category?.id) {
			this.bpSargal = this.allBpSargal.filter((item) => {
				return item.partner.categoryPartner.id === category?.id
			});
		} else {
			this.bpSargal = this.allBpSargal;
		}
  }

  fetchOffers() {
    this.loadingOffers = true;
    this.allBpSargal = [];
    this.bpSargalService
      .getBonsPlansSargal()
      .pipe(
        tap((bonsPlansSargal: BonPlanSargalModel[]) => {
          this.sargalCard = this.sargalCard ? this.sargalCard : bonsPlansSargal[0];
          this.allBpSargal = this.bpSargal = bonsPlansSargal[0]?.partnerReductions || [];
					this.bpSargalCategories = this.getCategoryList(this.sargalCard);
					[this.selectedCategoryFilter, ] = this.bpSargalCategories;
          this.loadingOffers = false;
        }),
        catchError(err => {
          this.loadingOffers = false;
          return throwError(err);
        })
      )
      .subscribe();
  }

	getCategoryList(sargalCard: BonPlanSargalModel) {
		const categoryList = this.sargalCard.partnerReductions.map((item) => {
			return item.partner.categoryPartner;
		});

		const	responseWithoutDuplication = categoryList.filter((item, index, a) => a.findIndex(t => t?.id === item?.id) === index);
		return responseWithoutDuplication;

	}
}
