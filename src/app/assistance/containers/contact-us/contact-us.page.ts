import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FACEBOOK_URL, MAIL_URL, TWITTER_URL } from 'src/shared';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss']
})
export class ContactUsPage implements OnInit {
  constructor(private dashboardService: DashboardService) {
    this.dashboardService.addDimeloScript();
  }

  goToPage(page: string) {
    let src: string;
    switch (page) {
      case 'facebook':
        src = FACEBOOK_URL;
        break;
      case 'mail':
        src = MAIL_URL;
        break;
      default:
        src = TWITTER_URL;
        break;
    }
    window.open(src);
  }

  ngOnInit() {}
}
