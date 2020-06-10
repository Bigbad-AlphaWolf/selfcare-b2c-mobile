import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { OfferPlan } from '../models/offer-plan.model';

@Component({
  selector: 'app-item-offer-plan',
  templateUrl: './item-offer-plan.component.html',
  styleUrls: ['./item-offer-plan.component.scss'],
})
export class ItemOfferPlanComponent implements OnInit {
  @Input() offerPlan: OfferPlan;
  @Output() selectOfferPlans = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  chooseOfferPlan(offer: OfferPlan){
    this.selectOfferPlans.emit(offer);
  }

  formatOfferPlanInfos(offer: OfferPlan){
    switch (offer.typeMPO.toLowerCase()) {
      case 'illimix':
      case 'internet':
        return 'Achète un '+offer.bpTarget
      default:
        return offer.bpTarget;
    }
  }
}
