import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as SecureLS from 'secure-ls';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { FACE_ID_OM_INFOS, OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-face-id-request-modal',
  templateUrl: './face-id-request-modal.component.html',
  styleUrls: ['./face-id-request-modal.component.scss'],
})
export class FaceIdRequestModalComponent implements OnInit {
  @Input() operationData;
  @Input() forActivated: boolean;
  msisdn: string;

  constructor(
    private omService: OrangeMoneyService,
    private modalController: ModalController,
    private oemLoggingService: OemLoggingService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.msisdn = this.dashboardService.getCurrentPhoneNumber();
  }

  close() {
    this.modalController.dismiss();
  }

  allowFaceId() {
    this.omService.allowFaceId();
    ls.set(FACE_ID_OM_INFOS, this.operationData);
    this.oemLoggingService.registerEvent('Allow_Face_ID_From_Modal', convertObjectToLoggingPayload({ msisdn: this.msisdn }));
    this.modalController.dismiss();
  }

  denyFaceId() {
    this.oemLoggingService.registerEvent('Deny_Face_ID_From_Modal', convertObjectToLoggingPayload({ msisdn: this.msisdn }));
    this.omService.denyFaceId();
    this.modalController.dismiss();
  }

  askLaterFaceId() {
    this.oemLoggingService.registerEvent('Ask_Later_Face_ID_From_Modal', convertObjectToLoggingPayload({ msisdn: this.msisdn }));
    this.omService.askFaceIdLater();
    this.modalController.dismiss();
  }
}
