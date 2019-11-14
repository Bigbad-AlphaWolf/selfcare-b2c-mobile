import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
declare var FollowAnalytics: any;

interface SocialNetworkApp {
  icon: string;
  label: string;
  selected: boolean;
}

@Component({
  selector: 'app-share-social-network',
  templateUrl: './share-social-network.component.html',
  styleUrls: ['./share-social-network.component.scss']
})
export class ShareSocialNetworkComponent implements OnInit {
  socialNetworkList: SocialNetworkApp[] = [
    {
      icon: '/assets/images/facebook_fab_icon.svg',
      label: 'Facebook',
      selected: false
    },
    {
      icon: '/assets/images/twitter_fab_icon.svg',
      label: 'Twitter',
      selected: false
    },
    // {
    //   icon: '/assets/images/linkedin_fab_icon.svg',
    //   label: 'Linkedin',
    //   selected: false
    // },
    {
      icon: '/assets/images/whatsapp.svg',
      label: 'Whatsapp',
      selected: false
    }
  ];
  constructor(
    private dialogRef: MatDialogRef<ShareSocialNetworkComponent>,
    private dashboardService: DashboardService,
    private socialSharing: SocialSharing
  ) {}

  ngOnInit() {}
  close() {
    this.dialogRef.close();
  }

  selectItem(elt: SocialNetworkApp) {
    const currentPhoneNumber = this.dashboardService.getCurrentPhoneNumber();
    const index = this.socialNetworkList.indexOf(elt);
    this.socialNetworkList[index] = elt;
    const url = 'http://bit.ly/2NHn5aS';
    const postTitle =
    'Comme moi télécharge et connecte toi gratuitement sur l\'application ' +
    'Orange et Moi Fi rek la http://bit.ly/2NHn5aS ou sur www.orangeetmoi.sn ' +
    'Bu ande ak simplicité ak réseau mo gën #WaawKay';
    const hashtag = '#WaawKay';

    // text to use
    /* Crée ton compte gratuitement sur www.orangeetmoi.sn pour gérer tous tes services Orange de façon simple, pratique et rapide.
    Orange et moi c’est tout orange en UN clic. */
    // https://twitter.com/share?url=[post-url]&text=[post-title]&via=[via]&hashtags=[hashtags]
    // https://www.linkedin.com/shareArticle?url=[post-url]&title=[post-title]
    // https://wa.me/?text=[post-title] [post-url]

    const logModel = {
      msisdn: currentPhoneNumber,
      network: ''
    };
    this.shareToSocialNetwork(
      elt.label,
      elt.label === 'Twitter' ? postTitle + '&hashtags=' + hashtag : postTitle,
      url
    );
    logModel.network = elt.label;
    if (typeof FollowAnalytics !== 'undefined') {
      FollowAnalytics.logEvent('ShareApp', logModel);
    }
  }

  shareToSocialNetwork(socialNetwork: string, postTitle: string, url: string) {
    switch (socialNetwork) {
      case 'Whatsapp':
        this.socialSharing
          .shareViaWhatsApp(postTitle, null, url)
          .then()
          .catch((err: any) => {
            this.defaulSharingSheet(postTitle, url);
          });
        break;
      case 'Twitter':
        this.socialSharing
          .shareViaTwitter(postTitle, null, url)
          .then()
          .catch((err: any) => {
            this.defaulSharingSheet(postTitle, url);
          });
        break;
      case 'Facebook':
        this.socialSharing
          .shareViaFacebook(postTitle, null, url)
          .then()
          .catch((err: any) => {
            this.defaulSharingSheet(postTitle, url);
          });
        break;
      default:
        this.defaulSharingSheet(postTitle, url);
        break;
    }
  }

  defaulSharingSheet(post: string, url: string) {
    this.socialSharing
      .share(post, null, null, url)
      .then()
      .catch((err: any) => {
        console.log('Cannot open default sharing sheet' + err);
      });
  }
}
