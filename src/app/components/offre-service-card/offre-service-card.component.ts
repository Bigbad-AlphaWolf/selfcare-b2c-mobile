import { Component, Input, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { OffreService } from 'src/app/models/offre-service.model';
import { FILE_DOWNLOAD_ENDPOINT } from 'src/app/services/utils/file.endpoints';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { OperationService } from 'src/app/services/oem-operation/operation.service';
import { OfcService } from 'src/app/services/ofc/ofc.service';
import { ServiceCode } from 'src/app/models/enums/service-code.enum';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { NumberSelectionOption } from 'src/app/models/enums/number-selection-option.enum';

@Component({
  selector: 'oem-offre-service-card',
  templateUrl: './offre-service-card.component.html',
  styleUrls: ['./offre-service-card.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('fadeAnimation', [
      state('in', style({ opacity: 1 })),

      transition(':enter', [style({ opacity: 0 }), animate(400)]),

      transition(':leave', animate(400, style({ opacity: 0 }))),
    ]),
  ],
})
export class OffreServiceCardComponent implements OnInit {
  @Input('service') service: OffreService;
  FILE_BASE_URL: string = FILE_DOWNLOAD_ENDPOINT;
  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private ofcService: OfcService,
    private bsService: BottomSheetService
  ) {}
  imageUrl: string;

  ngOnInit() {
    this.imageUrl = this.service.icone;
  }

  onClick() {
    if (!this.service.activated) {
      this.showServiceUnavailableToast();
      // this.service.clicked = !this.service.clicked;
      return;
    }
    if (this.service.code + '' === ServiceCode.OFC) {
      this.ofcService.loadOFC();
      return;
    }
    if (this.service.redirectionType === 'NAVIGATE')
      this.navCtrl.navigateForward([this.service.redirectionPath], {
        state: { purchaseType: this.service.code },
      });
    if (this.bsService[this.service.redirectionType]) {
      const params = [
        NumberSelectionOption.WITH_MY_PHONES,
        this.service.code,
        this.service.redirectionPath,
      ];
      this.bsService[this.service.redirectionType](...params);
      return;
    }
  }

  onErrorImg() {
    this.imageUrl =
      'assets/images/04-boutons-01-illustrations-01-acheter-credit-ou-pass.svg';
  }

  async showServiceUnavailableToast() {
    const toast = await this.toastController.create({
      header: 'Service indisponible',
      message: this.service.reasonDeactivation,
      duration: 3000,
      position: 'middle',
      color: 'medium',
    });
    toast.present();
  }
}
