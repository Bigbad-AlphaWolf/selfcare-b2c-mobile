import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AssistanceService } from '../services/assistance.service';
import { ItemBesoinAide, ASSISTANCE_URL } from 'src/shared';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-assistance',
  templateUrl: './assistance.page.html',
  styleUrls: ['./assistance.page.scss']
})
export class AssistancePage implements OnInit {
  listQuestions: ItemBesoinAide[] = [];
  isLoaded = false;
  constructor(
    private assistService: AssistanceService,
    private dashbServ: DashboardService,
    private ref: ChangeDetectorRef,
    private iab: InAppBrowser
  ) {}

  ngOnInit() {
    // Google Analytics Events
    // this.gtag.event('click_button', {
    //     event_category: 'Dashboard',
    //     event_action: 'click_button',
    //     event_label: 'Besoin d’aides?'
    // });
  }
  ionViewWillEnter() {
    const userPhoneNumber = this.dashbServ.getCurrentPhoneNumber();
    this.assistService.setUserNumber(userPhoneNumber);
    this.assistService.setListItemBesoinAide();
    this.assistService
      .getStatusLoadingBesoinAideItems()
      .subscribe((status: boolean) => {
        this.isLoaded = status;
        if (this.isLoaded) {
          this.listQuestions = this.assistService.getListItemBesoinAide();
        }
        this.ref.detectChanges();
      });
  }

  goToCommunityExternalPage(){
    this.iab.create(ASSISTANCE_URL, '_self');
  }
}
