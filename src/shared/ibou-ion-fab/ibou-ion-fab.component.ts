import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-ibou-ion-fab',
  templateUrl: './ibou-ion-fab.component.html',
  styleUrls: ['./ibou-ion-fab.component.scss'],
})
export class IbouIonFabComponent implements OnInit {
  fabOpened = false;

  constructor(private router: Router, private followAnalyticsService: FollowAnalyticsService, private socialSharing: SocialSharing) { }

  ngOnInit() {}

  fabToggled() {
    this.fabOpened = !this.fabOpened;
  }

  goAssistance() {
    this.router.navigate(['/control-center']);
    this.followAnalyticsService.registerEventFollow(
      'Assistance_via_Ibou',
      'event',
      'clicked'
    );
  }

  defaulSharingSheet() {
    const url = 'http://bit.ly/2NHn5aS';
    const postTitle =
    'Comme moi télécharge et connecte toi gratuitement sur l\'application ' +
    'Orange et Moi Fi rek la http://bit.ly/2NHn5aS ou sur www.orangeetmoi.sn ' +
    'Bu ande ak simplicité ak réseau mo gën #WaawKay';
    const hashtag = '#WaawKay';

    this.socialSharing
      .share(postTitle, null, null, url)
      .then()
      .catch((err: any) => {
        console.log('Cannot open default sharing sheet' + err);
      });
  }
}
