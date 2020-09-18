import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OffreService } from 'src/app/models/offre-service.model';
import { FILE_PATH } from 'src/app/services/utils/services.endpoints';

@Component({
  selector: 'oem-offre-service-card',
  templateUrl: './offre-service-card.component.html',
  styleUrls: ['./offre-service-card.component.scss'],
})
export class OffreServiceCardComponent implements OnInit {
  @Input('service') service: OffreService;
  FILE_BASE_URL: string = FILE_PATH;
  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  onClick() {
    if (!this.service.redirectionPath) return;
    this.navCtrl.navigateForward(this.service.redirectionPath, {
      state: { purchaseType: this.service.redirectionType },
    });
  }
}
