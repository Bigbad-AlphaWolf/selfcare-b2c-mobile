import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
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
    {
      icon: '/assets/images/linkedin_fab_icon.svg',
      label: 'Linkedin',
      selected: false
    },
    {
      icon: '/assets/images/whatsapp.svg',
      label: 'Whatsapp',
      selected: false
    }
  ];
  constructor(
    private dialogRef: MatDialogRef<ShareSocialNetworkComponent>,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {}
  close() {
    this.dialogRef.close();
  }

  selectItem(elt: SocialNetworkApp) {
    const currentPhoneNumber = this.dashboardService.getCurrentPhoneNumber();
    const index = this.socialNetworkList.indexOf(elt);
    this.socialNetworkList[index] = elt;
    const url = 'https://orangeetmoi.orange.sn';
    const postTitle =
      'Crée ton compte gratuitement sur www.orangeetmoi.sn pour' +
      ' gérer tous tes services Orange de façon simple, pratique et rapide.' +
      'Orange et moi c’est tout Orange en UN clic.';
    const hashtag = 'orangeetmoisn';

    //text to use
    /* Crée ton compte gratuitement sur www.orangeetmoi.sn pour gérer tous tes services Orange de façon simple, pratique et rapide.
    Orange et moi c’est tout orange en UN clic. */
    //https://twitter.com/share?url=[post-url]&text=[post-title]&via=[via]&hashtags=[hashtags]
    //https://www.linkedin.com/shareArticle?url=[post-url]&title=[post-title]
    //https://wa.me/?text=[post-title] [post-url]

    let popupWindow;
    const logModel = {
      msisdn: currentPhoneNumber,
      network: ''
    };
    if (elt.label === 'Facebook') {
      popupWindow = window.open(
        'https://www.facebook.com/sharer.php?u=https://orangeetmoi.orange.sn/',
        'facebook-popup',
        'height=350,width=600'
      );
      logModel.network = elt.label;
      // FollowAnalytics.logEvent('ShareApp', logModel);
    }
    if (elt.label === 'Twitter') {
      popupWindow = window.open(
        'https://twitter.com/share?url=' +
          url +
          '&text=' +
          postTitle +
          '&hashtags=' +
          hashtag,
        'twitter-popup',
        'height=350,width=600'
      );
      logModel.network = elt.label;
      // FollowAnalytics.logEvent('ShareApp', logModel);
    }
    if (elt.label === 'Linkedin') {
      popupWindow = window.open(
        'https://www.linkedin.com/shareArticle?url=' +
          url +
          '&title=' +
          postTitle,
        'linkdin-popup',
        'height=350,width=600'
      );
      logModel.network = elt.label;
      // FollowAnalytics.logEvent('ShareApp', logModel);
    }
    if (elt.label === 'Whatsapp') {
      popupWindow = window.open(
        'https://wa.me/?text=' + postTitle + ' ' + url,
        'wa-popup',
        'height=350,width=600'
      );
      logModel.network = elt.label;
      // FollowAnalytics.logEvent('ShareApp', logModel);
    }
    if (popupWindow.focus) {
      popupWindow.focus();
    }
  }
}
