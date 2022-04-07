import { Component, OnInit } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { DashboardService } from "src/app/services/dashboard-service/dashboard.service";
import { FollowAnalyticsEventType } from "src/app/services/follow-analytics/follow-analytics-event-type.enum";
import { FollowAnalyticsService } from "src/app/services/follow-analytics/follow-analytics.service";
import { OrangeMoneyService } from "src/app/services/orange-money-service/orange-money.service";

@Component({
  selector: "app-face-id-alert-popup",
  templateUrl: "./face-id-alert-popup.component.html",
  styleUrls: ["./face-id-alert-popup.component.scss"],
})
export class FaceIdAlertPopupComponent implements OnInit {
  constructor(
    private omService: OrangeMoneyService,
    private toastController: ToastController,
    private followAnalyticsService: FollowAnalyticsService,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit() {}

  close() {
    this.omService.denyFaceId();
  }

  async activate() {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    this.followAnalyticsService.registerEventFollow('Activate_Face_Id_From_Menu_Alert', FollowAnalyticsEventType.EVENT, {msisdn})
    this.omService.allowFaceId();
    const toast = await this.toastController.create({
      header: "Activation FaceID/TouchID",
      message:
        "Vous venez d'activer FaceID/TouchID. Vous pouvez désormais effectuer toute transaction Orange Money sans renseigner votre code OM",
      duration: 3000,
      position: "middle",
      color: "medium",
    });
    toast.present();
  }
}
