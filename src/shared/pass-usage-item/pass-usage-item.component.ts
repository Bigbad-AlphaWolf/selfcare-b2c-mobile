import { Component, Input, OnInit } from '@angular/core';
import { OffreService } from 'src/app/models/offre-service.model';
import { downloadAvatarEndpoint } from 'src/app/services/dashboard-service/dashboard.service';

@Component({
  selector: 'app-pass-usage-item',
  templateUrl: './pass-usage-item.component.html',
  styleUrls: ['./pass-usage-item.component.scss'],
})
export class PassUsageItemComponent implements OnInit {
  @Input() serviceUsage: OffreService;
  @Input() passUsage: any;
  mockBackground = '/assets/images/background_wido.png';
  downloadAvatarEndpoint = downloadAvatarEndpoint;

  constructor() {}

  ngOnInit() {}

  getValidity() {
    if (!this.passUsage || !this.passUsage.categoriePass) return;
    let validity = this.passUsage.categoriePass.libelle;
    switch (validity) {
      case 'Jour':
        validity = 'valable 24 heures';
        break;
      case '3 Jours':
        validity = 'valable 3 jours';
        break;
      case 'Semaine':
        validity = 'valable 7 jours';
        break;
      case 'Mois':
        validity = 'valable 1mois';
        break;
      default:
        break;
    }
    return validity;
  }
}
