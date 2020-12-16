import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NavController } from '@ionic/angular';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import {
  ASSISTANCE_URL,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  TWITTER_URL,
} from 'src/shared';
import { environment } from 'src/environments/environment.prod';
const { DIMELO_CHAT_MARKUP } = environment;

@Component({
  selector: 'app-contact-ibou-page',
  templateUrl: './contact-ibou-page.component.html',
  styleUrls: ['./contact-ibou-page.component.scss'],
})
export class ContactIbouPageComponent implements OnInit, AfterViewInit {
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
  DIMELO_CHAT_MARKUP = DIMELO_CHAT_MARKUP;
  constructor(
    private inAppBrowser: InAppBrowser,
    private navController: NavController,
    private dashboardService: DashboardService,
    private el: ElementRef
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.dashboardService.prepareScriptChatIbou();
    this.hideChatBlock();
  }

  hideChatBlock() {
    const chatBlock = this.el.nativeElement.querySelectorAll(
      '.dimelo_chat_item_markup'
    )[0];
    chatBlock.setAttribute('display', 'none');
    chatBlock.style.display = 'none';
  }

  chatWithIbou() {
    const btn = this.el.nativeElement.querySelectorAll(
      '.contact-container-body-block-btn'
    )[0];
    if (btn) btn.click();
  }
  ElementRef;
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
        src = INSTAGRAM_URL;
        break;
    }
    this.inAppBrowser.create(src, '_system');
  }

  goBack() {
    this.navController.pop();
  }
}
