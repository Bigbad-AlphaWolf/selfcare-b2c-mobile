import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';
import { FaceIdRequestModalComponent } from 'src/shared/face-id-request-modal/face-id-request-modal.component';

@Component({
  selector: 'app-face-id-alert-popup',
  templateUrl: './face-id-alert-popup.component.html',
  styleUrls: ['./face-id-alert-popup.component.scss'],
})
export class FaceIdAlertPopupComponent implements OnInit {
  constructor(
    private omService: OrangeMoneyService,
    private modalController: ModalController,
    private oemLoggingService: OemLoggingService,
    private dashboardService: DashboardService,
    private menuController: MenuController
  ) {}

  ngOnInit() {}

  close() {
    this.omService.denyFaceId();
  }

  async activate() {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    this.oemLoggingService.registerEvent('Activate_Face_Id_From_Menu_Alert', convertObjectToLoggingPayload({ msisdn: msisdn }));
    this.omService.allowFaceId();
    this.menuController.close();
    const modal = await this.modalController.create({
      component: FaceIdRequestModalComponent,
      cssClass: 'select-recipient-modal',
      backdropDismiss: true,
      componentProps: { forActivated: true },
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }
}
