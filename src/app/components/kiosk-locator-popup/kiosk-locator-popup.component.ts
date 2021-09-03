import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';

@Component({
  selector: 'app-kiosk-locator-popup',
  templateUrl: './kiosk-locator-popup.component.html',
  styleUrls: ['./kiosk-locator-popup.component.scss'],
})
export class KioskLocatorPopupComponent implements OnInit {
  constructor(
    private router: Router,
    private followAnalyticsService: FollowAnalyticsService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  continue() {
    this.modalController.dismiss();
    this.followAnalyticsService.registerEventFollow(
      'Kiosk_locator_opened',
      'event'
    );
    this.router.navigate(['kiosk-locator']);
  }
}
