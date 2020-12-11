import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { environment } from 'src/environments/environment.prod';
const { DIMELO_CHAT_MARKUP } = environment;
@Component({
  selector: 'app-ibou-ion-fab',
  templateUrl: './ibou-ion-fab.component.html',
  styleUrls: ['./ibou-ion-fab.component.scss'],
})
export class IbouIonFabComponent implements OnInit, AfterViewInit {
  fabOpened = false;
  DIMELO_CHAT_MARKUP = DIMELO_CHAT_MARKUP;
  constructor(
    private router: Router,
    private followAnalyticsService: FollowAnalyticsService,
    private socialSharing: SocialSharing,
    private dashboardService: DashboardService,
    private el: ElementRef
  ) {}
  ngAfterViewInit() {
    this.getButtonChat();
    this.getButtonChat();
  }

  ngOnInit() {}

  ionViewWillEnter() {
    console.log('tr');

    this.dashboardService.prepareScriptChatIbou();
  }

  af;

  getButtonChat() {
    if (!this.el.nativeElement.shadowRoot) return;
    let button = this.el.nativeElement.shadowRoot.querySelector(
      '.contact-container-body-block-btn'
    );
    console.log(button);
  }

  fabToggled() {
    this.fabOpened = !this.fabOpened;
    this.followAnalyticsService.registerEventFollow(
      'click_on_Ibou',
      'event',
      'clicked'
    );
    this.getButtonChat();
  }

  goAssistance() {
    this.router.navigate(['/control-center']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_via_Ibou',
      'event',
      'clicked'
    );
  }

  goToBesoinAide() {
    this.router.navigate(['/assistance']);
    this.followAnalyticsService.registerEventFollow(
      'page_faq_via_Ibou',
      'event',
      'clicked'
    );
  }

  defaulSharingSheet() {
    const url = 'http://bit.ly/2NHn5aS';
    const postTitle =
      "Comme moi télécharge et connecte toi gratuitement sur l'application " +
      'Orange et Moi Fi rek la http://onelink.to/6h78t2 ou sur www.orangeetmoi.sn ' +
      'Bu ande ak simplicité ak réseau mo gën #WaawKay';
    const hashtag = '#WaawKay';

    this.socialSharing
      .share(postTitle, null, null, url)
      .then()
      .catch((err: any) => {
        console.log('Cannot open default sharing sheet' + err);
      });
    this.followAnalyticsService.registerEventFollow(
      'share_application_via_Ibou',
      'event',
      'clicked'
    );
  }
}
