import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { environment } from 'src/environments/environment.prod';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import * as SecureLS from 'secure-ls';
import { ANALYTICS_PROVIDER, OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';
const ls = new SecureLS({ encodingType: 'aes' });
const { DIMELO_CHAT_MARKUP } = environment;
@Component({
  selector: 'app-ibou-ion-fab',
  templateUrl: './ibou-ion-fab.component.html',
  styleUrls: ['./ibou-ion-fab.component.scss'],
})
export class IbouIonFabComponent implements OnInit {
  fabOpened = false;
  DIMELO_CHAT_MARKUP = DIMELO_CHAT_MARKUP;
  currentMsisdn: string;
  @Output() goTabAssistance: EventEmitter<any> = new EventEmitter();

  constructor(
    private router: Router,
    private oemLoggingService: OemLoggingService,
    private socialSharing: SocialSharing,
    private el: ElementRef,
    private dashboardServ: DashboardService,
    private authServ: AuthenticationService
  ) {}

  ngOnInit() {
    this.currentMsisdn = this.dashboardServ.getCurrentPhoneNumber();
  }

  ionViewWillEnter() {}

  fabToggled() {
    //this.fabOpened = !this.fabOpened;
    this.oemLoggingService.registerEvent('Dashboard_click_on_Ibou', null, ANALYTICS_PROVIDER.ALL);
    this.openDimeloChat();
  }

  openDimeloChat() {
    const user: { birthDate: string; familyName: string; givenName: string; gender: string } = ls.get('userInfos');
    const username = `${user?.givenName?.toLowerCase()} ${user?.familyName?.toLowerCase()}`;
    console.log('username dimelo', username);
    const msisdn = this.dashboardServ.getMainPhoneNumber();
    // @ts-ignore
    cordova.exec(
      res => {
        console.log('Dimelo Plugin res', res);
      },
      err => {
        console.log('Dimelo Plugin err', err);
      },
      'DimeloCordovaPlugin',
      'openChat',
      [username, msisdn]
    );
  }

  hideChatBlock() {
    const chatBlock = this.el.nativeElement.querySelectorAll('.dimelo_chat_item_markup')[0];
    chatBlock.setAttribute('display', 'none');
    chatBlock.style.display = 'none';
  }

  chatWithIbou() {
    const btn = this.el.nativeElement.querySelectorAll('.contact-container-body-block-btn')[0];
    if (btn) btn.click();
  }
}
