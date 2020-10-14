import { Component, Input, OnInit } from '@angular/core';
import { NavController} from '@ionic/angular';
import { OffreService } from 'src/app/models/offre-service.model';
import { FILE_DOWNLOAD_ENDPOINT } from 'src/app/services/utils/file.endpoints';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'oem-offre-service-card',
  templateUrl: './offre-service-card.component.html',
  styleUrls: ['./offre-service-card.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('fadeAnimation', [

      state('in', style({opacity: 1})),

      transition(':enter', [
        style({opacity: 0}),
        animate(400 )
      ]),

      transition(':leave',
        animate(400, style({opacity: 0})))
    ])
  ]      
})
export class OffreServiceCardComponent implements OnInit {
  @Input('service') service: OffreService;
  FILE_BASE_URL: string = FILE_DOWNLOAD_ENDPOINT;
  constructor(private navCtrl: NavController) {}
  imageUrl : string;

  ngOnInit() {
    this.imageUrl = this.FILE_BASE_URL+'/'+this.service.icone;
  }

  onClick() {
    if(!this.service.activated){
      this.service.clicked =  !this.service.clicked;
      return;
    }
    if (!this.service.redirectionPath) return;
    this.navCtrl.navigateForward(this.service.redirectionPath, {
      state: { purchaseType: this.service.redirectionType },
    });
  }

  onErrorImg(){
    this.imageUrl = 'assets/images/ic-package-services@2x.png';
  }
}
