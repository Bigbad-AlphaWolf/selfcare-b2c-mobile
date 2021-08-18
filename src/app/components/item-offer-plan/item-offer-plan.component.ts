import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { OfferPlan } from '../../../shared/models/offer-plan.model';
import { CATEGORY_MPO } from 'src/app/utils/constants';

@Component({
	selector: 'app-item-offer-plan',
	templateUrl: './item-offer-plan.component.html',
	styleUrls: ['./item-offer-plan.component.scss'],
})
export class ItemOfferPlanComponent implements OnInit {
	@Input() offerPlan: OfferPlan;
	@Input() isChecking: boolean;
	@Output() selectOfferPlans = new EventEmitter();
	constructor() {}

	ngOnInit() {}

	chooseOfferPlan(offer: OfferPlan) {
		this.selectOfferPlans.emit(offer);
	}

	formatOfferPlanInfos(offer: OfferPlan) {
		if (offer)
			switch (offer.typeMPO.toLowerCase()) {
				case CATEGORY_MPO.illimix:
				case CATEGORY_MPO.internet:
					return 'Achète un ' + offer.bpTarget;
				default:
					return offer.bpTarget;
			}
	}
}
