import { Component, Input, OnInit } from '@angular/core';
import { NewUserConsoModel } from 'src/app/services/user-cunsommation-service/user-conso-service.index';

@Component({
  selector: 'app-item-conso-gauge',
  templateUrl: './item-conso-gauge.component.html',
  styleUrls: ['./item-conso-gauge.component.scss'],
})
export class ItemConsoGaugeComponent implements OnInit {
  @Input() conso: NewUserConsoModel;
  Math = Math;
  constructor() {}

  ngOnInit() {
    console.log(this.conso);
  }
}
