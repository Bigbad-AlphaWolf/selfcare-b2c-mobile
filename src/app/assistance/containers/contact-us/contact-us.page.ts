import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FACEBOOK_URL, MAIL_URL, TWITTER_URL } from 'src/shared';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { environment } from "src/environments/environment.prod";
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
const { DIMELO_CHAT_MARKUP } = environment;
// PROD VALUE OF DIMELO_MARKUP IS USED

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss']
})
export class ContactUsPage implements OnInit {
  DIMELO_CHAT_MARKUP = DIMELO_CHAT_MARKUP;
  constructor(private dashboardService: DashboardService, private iab: InAppBrowser, private router: Router) {
    // this.dashboardService.addDimeloScript();
  }

  ionViewWillEnter(){
    this.dashboardService.prepareScriptChatIbou();
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
    this.iab.create(src, '_system');
    // window.open(src);
  }

  ngOnInit() {}

  goBack(){
    this.router.navigate(['/assistance'])
  }
}
