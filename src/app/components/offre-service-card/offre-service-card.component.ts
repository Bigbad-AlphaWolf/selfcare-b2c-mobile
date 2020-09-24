import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { OffreService } from 'src/app/models/offre-service.model';
import { FILE_DOWNBLOAD_ENDPOINT } from 'src/app/services/utils/file.endpoints';

@Component({
  selector: 'oem-offre-service-card',
  templateUrl: './offre-service-card.component.html',
  styleUrls: ['./offre-service-card.component.scss'],
})
export class OffreServiceCardComponent implements OnInit {
  @Input('service') service: OffreService;
  FILE_BASE_URL: string = FILE_DOWNBLOAD_ENDPOINT;
  constructor(private navCtrl: NavController) {}
  imageUrl : string;

  ngOnInit() {
    this.imageUrl = this.FILE_BASE_URL+'/'+this.service.icone;
  }

  onClick() {
    if (!this.service.redirectionPath) return;
    this.navCtrl.navigateForward(this.service.redirectionPath, {
      state: { purchaseType: this.service.redirectionType },
    });
  }

  onErrorImg(){
    this.imageUrl = 'assets/images/ic-package-services@2x.png';
  }
}
