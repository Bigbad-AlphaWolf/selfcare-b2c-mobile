import { Component, Input, OnInit } from '@angular/core';
import { BannierePubModel } from 'src/app/services/dashboard-service';
import { getBanniereDescription, getBanniereTitle, TYPE_ACTION_ON_BANNER } from 'src/shared';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavController } from '@ionic/angular';
import { BanniereDescriptionPage } from 'src/app/pages/banniere-description/banniere-description.page';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';

@Component({
  selector: 'app-slide-banniere-dashboard',
  templateUrl: './slide-banniere-dashboard.component.html',
  styleUrls: ['./slide-banniere-dashboard.component.scss'],
})
export class SlideBanniereDashboardComponent implements OnInit {
  @Input() listBanniere: BannierePubModel[];
  constructor(private iab: InAppBrowser, private navCtrl: NavController, private bottomSheetServ: BottomSheetService) { }

  ngOnInit() {}

  getBanniereTitle(description: string) {
    return getBanniereTitle(description);
  }

  getBanniereDescription(description: string) {
    return getBanniereDescription(description);
  }

  onBannerClicked(item: BannierePubModel) {
    if (!item.callToAction) return;
    switch (item.action.typeAction) {
      case TYPE_ACTION_ON_BANNER.DEEPLINK:
        this.navCtrl.navigateForward([item.action.url]);
        break;
      case TYPE_ACTION_ON_BANNER.REDIRECTION:
        this.iab.create(item.action.url, '_blank')
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
