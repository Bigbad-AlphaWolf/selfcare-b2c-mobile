import { Component, Input, OnInit } from '@angular/core';
import { PartnerReductionModel } from 'src/app/models/bons-plans-sargal.model';

@Component({
  selector: 'app-sargal-reduction-card',
  templateUrl: './sargal-reduction-card.component.html',
  styleUrls: ['./sargal-reduction-card.component.scss'],
})
export class SargalReductionCardComponent implements OnInit {
  @Input() displayVersion: 'v1' | 'v2' = 'v1';
  @Input() bonPlan: PartnerReductionModel;

  constructor() {}

  ngOnInit() {
    console.log(this.bonPlan);
  }

}
