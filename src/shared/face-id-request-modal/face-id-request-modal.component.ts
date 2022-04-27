import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as SecureLS from 'secure-ls';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsEventType } from 'src/app/services/follow-analytics/follow-analytics-event-type.enum';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import {
  FACE_ID_OM_INFOS,
  OrangeMoneyService,
} from 'src/app/services/orange-money-service/orange-money.service';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-face-id-request-modal',
  templateUrl: './face-id-request-modal.component.html',
  styleUrls: ['./face-id-request-modal.component.scss'],
})
export class FaceIdRequestModalComponent implements OnInit {
  @Input() operationData;
  msisdn: string;

  constructor(
    private omService: OrangeMoneyService,
    private modalController: ModalController,
    private followAnalyticsService: FollowAnalyticsService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.msisdn = this.dashboardService.getCurrentPhoneNumber();
  }

  allowFaceId() {
    this.omService.allowFaceId();
    ls.set(FACE_ID_OM_INFOS, this.operationData);
    this.followAnalyticsService.registerEventFollow(
      'Allow_Face_ID_From_Modal',
      FollowAnalyticsEventType.EVENT,
      { msisdn: this.msisdn }
    );
    this.modalController.dismiss();
  }

  denyFaceId() {
    this.followAnalyticsService.registerEventFollow(
      'Deny_Face_ID_From_Modal',
      FollowAnalyticsEventType.EVENT,
      { msisdn: this.msisdn }
    );
    this.omService.denyFaceId();
    this.modalController.dismiss();
  }

  askLaterFaceId() {
    this.followAnalyticsService.registerEventFollow(
      'Ask_Later_Face_ID_From_Modal',
      FollowAnalyticsEventType.EVENT,
      { msisdn: this.msisdn }
    );
    this.omService.askFaceIdLater();
    this.modalController.dismiss();
  }
}
