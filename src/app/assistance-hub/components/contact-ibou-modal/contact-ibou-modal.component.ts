import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ASSISTANCE_URL, FACEBOOK_URL, TWITTER_URL } from 'src/shared';

@Component({
  selector: 'app-contact-ibou-modal',
  templateUrl: './contact-ibou-modal.component.html',
  styleUrls: ['./contact-ibou-modal.component.scss'],
})
export class ContactIbouModalComponent implements OnInit {
  channels = [
    {
      code: 'FACEBOOK',
      description: 'Via Facebook',
      image: '/assets/images/fbk.png',
    },
    {
      code: 'INSTAGRAM',
      description: 'Via Instagram',
      image: '/assets/images/ig.png',
    },
    {
      code: 'TWITTER',
      description: 'Via Twitter',
      image: '/assets/images/twtr.png',
    },
    {
      code: 'ORANGE',
      description: 'Via Orange.sn',
      image:
        '/assets/images/04-boutons-01-illustrations-21-ibou-assistance.png',
    },
  ];
  constructor(private inAppBrowser: InAppBrowser) {}

  ngOnInit() {}

  goChannel(channel) {
    let src: string;
    switch (channel.code) {
      case 'FACEBOOK':
        src = FACEBOOK_URL;
        break;
      case 'TWITTER':
        src = TWITTER_URL;
        break;
      case 'ORANGE':
        src = ASSISTANCE_URL;
        break;
      case 'INSTAGRAM':
        return;
        src = '';
        break;
    }
    this.inAppBrowser.create(src, '_system');
  }
}
