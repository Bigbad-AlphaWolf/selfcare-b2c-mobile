import { Component, Input, OnInit } from '@angular/core';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { getBanniereDescription, getBanniereTitle, TYPE_ACTION_ON_BANNER } from 'src/shared';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { NavController, Platform } from '@ionic/angular';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import SwiperCore, { Autoplay, Pagination } from 'swiper';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from 'src/app/utils/utils';

SwiperCore.use([Autoplay, Pagination]);

@Component({
  selector: 'app-slide-banniere-dashboard',
  templateUrl: './slide-banniere-dashboard.component.html',
  styleUrls: ['./slide-banniere-dashboard.component.scss'],
})
export class SlideBanniereDashboardComponent implements OnInit {
  @Input() listBanniere: BannierePubModel[];
  currentMsisdn;
  constructor(
    private iab: InAppBrowser,
    private navCtrl: NavController,
    private bottomSheetServ: BottomSheetService,
    private oemLoggingService: OemLoggingService,
    private dashboardService: DashboardService,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.currentMsisdn = this.dashboardService.getCurrentPhoneNumber();
  }

  getBanniereTitle(description: string) {
    return getBanniereTitle(description);
  }

  getBanniereDescription(description: string) {
    return getBanniereDescription(description);
  }

  onBannerClicked(item: BannierePubModel) {
    this.oemLoggingService.registerEvent(
      'banner_clicked',
      convertObjectToLoggingPayload({
        banniere: item,
        msisdn: this.currentMsisdn,
      })
    );
    if (!item.callToAction) return;
    switch (item.action.typeAction) {
      case TYPE_ACTION_ON_BANNER.DEEPLINK:
        this.navCtrl.navigateForward([item.action.url]);
        break;
      case TYPE_ACTION_ON_BANNER.REDIRECTION:
        const config: InAppBrowserOptions = this.platform.is('ios')
          ? {
              location: 'no',
              toolbar: 'yes',
              toolbarcolor: '#CCCCCC',
              toolbarposition: 'top',
              toolbartranslucent: 'no',
              closebuttoncolor: '#000000',
              closebuttoncaption: 'Fermer',
              hidespinner: 'yes',
            }
          : {};
        this.iab.create(item.action.url, '_blank', config);
        break;
      case TYPE_ACTION_ON_BANNER.MODAL:
        if (item.action.description) {
          //open description page
          this.bottomSheetServ.openBannerDescription(item);
        }
        break;
      default:
        break;
    }
  }
}
