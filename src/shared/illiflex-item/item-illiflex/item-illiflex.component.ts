import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-illiflex',
  templateUrl: './item-illiflex.component.html',
  styleUrls: ['./item-illiflex.component.scss'],
})
export class ItemIlliflexComponent implements OnInit {
  @Input() passIlliflex: {
    amount: number;
    data: number;
    voice: number;
    validity: string;
  };
  constructor() {}

  ngOnInit() {}

  getValidity(validity) {
    switch (validity) {
      case 'Jour':
        return 'Valable 24 heures';
      case 'Semaine':
        return 'Valable 7 jours';
      case 'Mois':
        return 'Valable 30 jours';
      default:
        break;
    }
  }
}
