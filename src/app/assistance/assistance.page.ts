import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AssistanceService } from '../services/assistance.service';
import { ItemBesoinAide } from 'src/shared';

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
    private dashbServ: DashboardService
  ) {}

  ngOnInit() {
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
      });
    // Google Analytics Events
    // this.gtag.event('click_button', {
    //     event_category: 'Dashboard',
    //     event_action: 'click_button',
    //     event_label: 'Besoin d’aides?'
    // });
  }
}
